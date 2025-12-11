# PHASE 9 CONTINUED - Sections 9.2-9.5

---

## 🎯 PHASE 9.2: ANDROID APP (JETPACK COMPOSE)

**Duration**: Weeks 4-6 (15 business days)  
**Owner**: Android Lead  
**Team**: 3 Android engineers, 1 QA  
**Budget**: $52,500

### 9.2.1 Android Architecture (Clean Architecture + MVI)

```kotlin
// android/app/src/main/java/com/intinc/claudeprofilebuilder/Architecture.kt

/**
 * Android App Architecture
 * Clean Architecture + MVI (Model-View-Intent) pattern
 */

package com.intinc.claudeprofilebuilder

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

// ═══════════════════════════════════════════════════════════
// MARK: - Domain Layer (Entities)
// ═══════════════════════════════════════════════════════════

data class Bookmark(
    val id: String,
    val title: String,
    val url: String,
    val category: String,
    val tags: List<String>,
    val createdAt: Long,
    val updatedAt: Long
)

data class Message(
    val id: String,
    val role: MessageRole,
    val content: String,
    val timestamp: Long,
    val isStreaming: Boolean = false
) {
    enum class MessageRole {
        USER, ASSISTANT, SYSTEM
    }
}

data class Conversation(
    val id: String,
    val title: String,
    val messages: List<Message>,
    val createdAt: Long,
    val updatedAt: Long
)

// ═══════════════════════════════════════════════════════════
// MARK: - Domain Layer (Use Cases)
// ═══════════════════════════════════════════════════════════

interface UseCase<in Input, out Output> {
    suspend operator fun invoke(input: Input): Output
}

class FetchBookmarksUseCase @Inject constructor(
    private val repository: BookmarkRepository
) : UseCase<Unit, List<Bookmark>> {
    override suspend fun invoke(input: Unit): List<Bookmark> {
        return repository.fetchBookmarks()
    }
}

class AddBookmarkUseCase @Inject constructor(
    private val repository: BookmarkRepository
) : UseCase<Bookmark, Unit> {
    override suspend fun invoke(input: Bookmark) {
        repository.addBookmark(input)
    }
}

class SendMessageUseCase @Inject constructor(
    private val repository: MessageRepository
) : UseCase<SendMessageInput, Flow<String>> {
    override suspend fun invoke(input: SendMessageInput): Flow<String> {
        return repository.sendMessage(input.conversationId, input.message)
    }
}

data class SendMessageInput(
    val conversationId: String,
    val message: String
)

// ═══════════════════════════════════════════════════════════
// MARK: - Data Layer (Repositories)
// ═══════════════════════════════════════════════════════════

interface BookmarkRepository {
    suspend fun fetchBookmarks(): List<Bookmark>
    suspend fun addBookmark(bookmark: Bookmark)
    suspend fun deleteBookmark(id: String)
    suspend fun syncBookmarks()
}

class BookmarkRepositoryImpl @Inject constructor(
    private val remoteDataSource: RemoteDataSource,
    private val localDataSource: LocalDataSource,
    private val syncService: SyncService
) : BookmarkRepository {
    
    override suspend fun fetchBookmarks(): List<Bookmark> {
        // Offline-first: return local data immediately
        val localBookmarks = localDataSource.fetchBookmarks()
        
        // Sync in background
        syncBookmarks()
        
        return localBookmarks
    }
    
    override suspend fun addBookmark(bookmark: Bookmark) {
        // Save locally first
        localDataSource.saveBookmark(bookmark)
        
        // Sync to server in background
        try {
            remoteDataSource.addBookmark(bookmark)
        } catch (e: Exception) {
            // Will be synced later
            syncService.queueForSync(SyncItem.Bookmark(bookmark))
        }
    }
    
    override suspend fun deleteBookmark(id: String) {
        localDataSource.deleteBookmark(id)
        
        try {
            remoteDataSource.deleteBookmark(id)
        } catch (e: Exception) {
            syncService.queueForSync(SyncItem.DeletedBookmark(id))
        }
    }
    
    override suspend fun syncBookmarks() {
        val lastSyncTime = syncService.getLastSyncTime("bookmarks")
        
        val changes = remoteDataSource.getChanges("bookmarks", lastSyncTime)
        
        // Apply changes locally
        changes.added.forEach { localDataSource.saveBookmark(it) }
        changes.updated.forEach { localDataSource.updateBookmark(it) }
        changes.deleted.forEach { localDataSource.deleteBookmark(it) }
        
        syncService.setLastSyncTime("bookmarks", System.currentTimeMillis())
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Data Layer (Data Sources)
// ═══════════════════════════════════════════════════════════

interface RemoteDataSource {
    suspend fun fetchBookmarks(): List<Bookmark>
    suspend fun addBookmark(bookmark: Bookmark)
    suspend fun deleteBookmark(id: String)
    suspend fun getChanges(resource: String, since: Long): SyncChanges
}

class RemoteDataSourceImpl @Inject constructor(
    private val apiClient: APIClient
) : RemoteDataSource {
    
    override suspend fun fetchBookmarks(): List<Bookmark> {
        return apiClient.get<List<Bookmark>>("/api/mobile/v1/bookmarks")
    }
    
    override suspend fun addBookmark(bookmark: Bookmark) {
        apiClient.post("/api/mobile/v1/bookmarks", bookmark)
    }
    
    override suspend fun deleteBookmark(id: String) {
        apiClient.delete("/api/mobile/v1/bookmarks/$id")
    }
    
    override suspend fun getChanges(resource: String, since: Long): SyncChanges {
        return apiClient.post<SyncChanges>(
            "/api/mobile/v1/sync",
            mapOf(
                "lastSyncTimestamp" to since,
                "resources" to listOf(resource)
            )
        )
    }
}

interface LocalDataSource {
    suspend fun fetchBookmarks(): List<Bookmark>
    suspend fun saveBookmark(bookmark: Bookmark)
    suspend fun updateBookmark(bookmark: Bookmark)
    suspend fun deleteBookmark(id: String)
}

class LocalDataSourceImpl @Inject constructor(
    private val database: AppDatabase
) : LocalDataSource {
    
    override suspend fun fetchBookmarks(): List<Bookmark> {
        return database.bookmarkDao().getAll().map { it.toDomain() }
    }
    
    override suspend fun saveBookmark(bookmark: Bookmark) {
        database.bookmarkDao().insert(BookmarkEntity.fromDomain(bookmark))
    }
    
    override suspend fun updateBookmark(bookmark: Bookmark) {
        database.bookmarkDao().update(BookmarkEntity.fromDomain(bookmark))
    }
    
    override suspend fun deleteBookmark(id: String) {
        database.bookmarkDao().delete(id)
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Room Database
// ═══════════════════════════════════════════════════════════

@Database(
    entities = [BookmarkEntity::class, MessageEntity::class],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun messageDao(): MessageDao
}

@Entity(tableName = "bookmarks")
data class BookmarkEntity(
    @PrimaryKey val id: String,
    val title: String,
    val url: String,
    val category: String,
    val tags: String, // JSON array
    val createdAt: Long,
    val updatedAt: Long
) {
    fun toDomain(): Bookmark {
        return Bookmark(
            id = id,
            title = title,
            url = url,
            category = category,
            tags = Json.decodeFromString(tags),
            createdAt = createdAt,
            updatedAt = updatedAt
        )
    }
    
    companion object {
        fun fromDomain(bookmark: Bookmark): BookmarkEntity {
            return BookmarkEntity(
                id = bookmark.id,
                title = bookmark.title,
                url = bookmark.url,
                category = bookmark.category,
                tags = Json.encodeToString(bookmark.tags),
                createdAt = bookmark.createdAt,
                updatedAt = bookmark.updatedAt
            )
        }
    }
}

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks ORDER BY createdAt DESC")
    suspend fun getAll(): List<BookmarkEntity>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(bookmark: BookmarkEntity)
    
    @Update
    suspend fun update(bookmark: BookmarkEntity)
    
    @Query("DELETE FROM bookmarks WHERE id = :id")
    suspend fun delete(id: String)
}

// ═══════════════════════════════════════════════════════════
// MARK: - Presentation Layer (MVI)
// ═══════════════════════════════════════════════════════════

// State
data class BookmarksState(
    val bookmarks: List<Bookmark> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

// Intent (User actions)
sealed class BookmarksIntent {
    object LoadBookmarks : BookmarksIntent()
    data class AddBookmark(val bookmark: Bookmark) : BookmarksIntent()
    data class DeleteBookmark(val id: String) : BookmarksIntent()
}

// Effect (Side effects)
sealed class BookmarksEffect {
    data class ShowError(val message: String) : BookmarksEffect()
    data class ShowSuccess(val message: String) : BookmarksEffect()
}

// ViewModel
@HiltViewModel
class BookmarksViewModel @Inject constructor(
    private val fetchBookmarksUseCase: FetchBookmarksUseCase,
    private val addBookmarkUseCase: AddBookmarkUseCase,
    private val deleteBookmarkUseCase: DeleteBookmarkUseCase
) : ViewModel() {
    
    private val _state = MutableStateFlow(BookmarksState())
    val state: StateFlow<BookmarksState> = _state.asStateFlow()
    
    private val _effect = MutableSharedFlow<BookmarksEffect>()
    val effect: SharedFlow<BookmarksEffect> = _effect.asSharedFlow()
    
    fun handleIntent(intent: BookmarksIntent) {
        when (intent) {
            is BookmarksIntent.LoadBookmarks -> loadBookmarks()
            is BookmarksIntent.AddBookmark -> addBookmark(intent.bookmark)
            is BookmarksIntent.DeleteBookmark -> deleteBookmark(intent.id)
        }
    }
    
    private fun loadBookmarks() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            
            try {
                val bookmarks = fetchBookmarksUseCase(Unit)
                _state.update {
                    it.copy(
                        bookmarks = bookmarks,
                        isLoading = false,
                        error = null
                    )
                }
            } catch (e: Exception) {
                _state.update {
                    it.copy(
                        isLoading = false,
                        error = e.message
                    )
                }
                _effect.emit(BookmarksEffect.ShowError(e.message ?: "Unknown error"))
            }
        }
    }
    
    private fun addBookmark(bookmark: Bookmark) {
        viewModelScope.launch {
            try {
                addBookmarkUseCase(bookmark)
                _effect.emit(BookmarksEffect.ShowSuccess("Bookmark added"))
                loadBookmarks() // Refresh list
            } catch (e: Exception) {
                _effect.emit(BookmarksEffect.ShowError(e.message ?: "Failed to add bookmark"))
            }
        }
    }
    
    private fun deleteBookmark(id: String) {
        viewModelScope.launch {
            try {
                deleteBookmarkUseCase(id)
                _effect.emit(BookmarksEffect.ShowSuccess("Bookmark deleted"))
                loadBookmarks() // Refresh list
            } catch (e: Exception) {
                _effect.emit(BookmarksEffect.ShowError(e.message ?: "Failed to delete bookmark"))
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - UI Layer (Jetpack Compose)
// ═══════════════════════════════════════════════════════════

@Composable
fun BookmarksScreen(
    viewModel: BookmarksViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    val scaffoldState = rememberScaffoldState()
    
    // Handle effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is BookmarksEffect.ShowError -> {
                    scaffoldState.snackbarHostState.showSnackbar(effect.message)
                }
                is BookmarksEffect.ShowSuccess -> {
                    scaffoldState.snackbarHostState.showSnackbar(effect.message)
                }
            }
        }
    }
    
    // Load bookmarks on first composition
    LaunchedEffect(Unit) {
        viewModel.handleIntent(BookmarksIntent.LoadBookmarks)
    }
    
    Scaffold(
        scaffoldState = scaffoldState,
        topBar = {
            TopAppBar(
                title = { Text("Bookmarks") }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* Show add bookmark dialog */ }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add bookmark")
            }
        }
    ) { padding ->
        when {
            state.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            state.error != null -> {
                ErrorView(
                    error = state.error!!,
                    onRetry = {
                        viewModel.handleIntent(BookmarksIntent.LoadBookmarks)
                    }
                )
            }
            
            else -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    items(state.bookmarks) { bookmark ->
                        BookmarkItem(
                            bookmark = bookmark,
                            onDelete = {
                                viewModel.handleIntent(
                                    BookmarksIntent.DeleteBookmark(bookmark.id)
                                )
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun BookmarkItem(
    bookmark: Bookmark,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        elevation = 2.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = bookmark.title,
                style = MaterialTheme.typography.h6
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = bookmark.url,
                style = MaterialTheme.typography.caption,
                color = Color.Gray
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Tags
            FlowRow(
                mainAxisSpacing = 8.dp,
                crossAxisSpacing = 8.dp
            ) {
                bookmark.tags.forEach { tag ->
                    Chip(text = tag)
                }
            }
            
            // Delete button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                IconButton(onClick = onDelete) {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = "Delete",
                        tint = Color.Red
                    )
                }
            }
        }
    }
}

@Composable
fun Chip(text: String) {
    Surface(
        color = MaterialTheme.colors.primary.copy(alpha = 0.1f),
        shape = RoundedCornerShape(16.dp)
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            style = MaterialTheme.typography.caption,
            color = MaterialTheme.colors.primary
        )
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Dependency Injection (Hilt)
// ═══════════════════════════════════════════════════════════

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "claude_profile_builder.db"
        ).build()
    }
    
    @Provides
    @Singleton
    fun provideAPIClient(): APIClient {
        return APIClient(baseUrl = "https://api.intinc.com")
    }
    
    @Provides
    @Singleton
    fun provideRemoteDataSource(apiClient: APIClient): RemoteDataSource {
        return RemoteDataSourceImpl(apiClient)
    }
    
    @Provides
    @Singleton
    fun provideLocalDataSource(database: AppDatabase): LocalDataSource {
        return LocalDataSourceImpl(database)
    }
    
    @Provides
    @Singleton
    fun provideBookmarkRepository(
        remoteDataSource: RemoteDataSource,
        localDataSource: LocalDataSource,
        syncService: SyncService
    ): BookmarkRepository {
        return BookmarkRepositoryImpl(remoteDataSource, localDataSource, syncService)
    }
}
```

---

## 🎯 PHASE 9.3: OFFLINE SYNC & CONFLICT RESOLUTION

**Duration**: Weeks 7-9 (15 business days)  
**Owner**: Backend Lead  
**Team**: 2 backend engineers, 2 mobile engineers, 1 QA  
**Budget**: $52,500

### 9.3.1 Offline Queue System

```typescript
// shared/offline-sync/OfflineQueueManager.ts

/**
 * Offline Queue Manager
 * Handles queuing and syncing offline changes
 */

export interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'bookmark' | 'preference' | 'message';
  data: any;
  timestamp: number;
  clientId: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export class OfflineQueueManager {
  private queue: OfflineOperation[] = [];
  private isSyncing = false;
  private syncInterval: NodeJS.Timer | null = null;
  
  constructor(
    private storage: Storage,
    private apiClient: APIClient,
    private logger: Logger
  ) {
    this.loadQueue();
    this.startPeriodicSync();
  }
  
  /**
   * Add operation to queue
   */
  async enqueue(operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<void> {
    const queuedOperation: OfflineOperation = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    };
    
    this.queue.push(queuedOperation);
    await this.saveQueue();
    
    this.logger.info('Operation queued', {
      operationId: queuedOperation.id,
      type: queuedOperation.type,
      resource: queuedOperation.resource
    });
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      await this.sync();
    }
  }
  
  /**
   * Sync all pending operations
   */
  async sync(): Promise<{
    processed: number;
    failed: number;
    conflicts: number;
  }> {
    if (this.isSyncing) {
      this.logger.debug('Sync already in progress');
      return { processed: 0, failed: 0, conflicts: 0 };
    }
    
    this.isSyncing = true;
    
    const results = {
      processed: 0,
      failed: 0,
      conflicts: 0
    };
    
    const pendingOperations = this.queue.filter(op => op.status === 'pending');
    
    for (const operation of pendingOperations) {
      try {
        operation.status = 'syncing';
        await this.saveQueue();
        
        const result = await this.syncOperation(operation);
        
        if (result.conflict) {
          results.conflicts++;
          operation.status = 'failed';
          this.logger.warn('Conflict detected', {
            operationId: operation.id,
            conflict: result.conflict
          });
        } else {
          operation.status = 'completed';
          results.processed++;
          this.logger.info('Operation synced', {
            operationId: operation.id
          });
        }
        
      } catch (error) {
        operation.retryCount++;
        
        if (operation.retryCount >= 3) {
          operation.status = 'failed';
          results.failed++;
          this.logger.error('Operation failed after 3 retries', error as Error, {
            operationId: operation.id
          });
        } else {
          operation.status = 'pending';
          this.logger.warn('Operation failed, will retry', {
            operationId: operation.id,
            retryCount: operation.retryCount
          });
        }
      }
      
      await this.saveQueue();
    }
    
    // Remove completed operations
    this.queue = this.queue.filter(op => op.status !== 'completed');
    await this.saveQueue();
    
    this.isSyncing = false;
    
    return results;
  }
  
  /**
   * Sync single operation
   */
  private async syncOperation(operation: OfflineOperation): Promise<{
    success: boolean;
    conflict?: any;
  }> {
    const endpoint = this.getEndpoint(operation);
    
    try {
      switch (operation.type) {
        case 'create':
          await this.apiClient.post(endpoint, operation.data);
          break;
          
        case 'update':
          const response = await this.apiClient.put(endpoint, operation.data);
          
          // Check for conflict (server version is newer)
          if (response.conflict) {
            return {
              success: false,
              conflict: response.serverVersion
            };
          }
          break;
          
        case 'delete':
          await this.apiClient.delete(endpoint);
          break;
      }
      
      return { success: true };
      
    } catch (error: any) {
      if (error.status === 409) {
        // Conflict error
        return {
          success: false,
          conflict: error.data
        };
      }
      
      throw error;
    }
  }
  
  /**
   * Get API endpoint for operation
   */
  private getEndpoint(operation: OfflineOperation): string {
    const baseUrl = '/api/mobile/v1';
    
    switch (operation.resource) {
      case 'bookmark':
        if (operation.type === 'create') {
          return `${baseUrl}/bookmarks`;
        } else {
          return `${baseUrl}/bookmarks/${operation.data.id}`;
        }
        
      case 'preference':
        return `${baseUrl}/preferences`;
        
      case 'message':
        return `${baseUrl}/messages`;
        
      default:
        throw new Error(`Unknown resource: ${operation.resource}`);
    }
  }
  
  /**
   * Start periodic sync (every 5 minutes)
   */
  private startPeriodicSync(): void {
    this.syncInterval = setInterval(async () => {
      if (navigator.onLine && this.queue.length > 0) {
        await this.sync();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  /**
   * Load queue from storage
   */
  private async loadQueue(): Promise<void> {
    const saved = await this.storage.get<OfflineOperation[]>('offline_queue');
    if (saved) {
      this.queue = saved;
      this.logger.info('Offline queue loaded', { count: this.queue.length });
    }
  }
  
  /**
   * Save queue to storage
   */
  private async saveQueue(): Promise<void> {
    await this.storage.set('offline_queue', this.queue);
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get queue status
   */
  getStatus(): {
    total: number;
    pending: number;
    syncing: number;
    failed: number;
  } {
    return {
      total: this.queue.length,
      pending: this.queue.filter(op => op.status === 'pending').length,
      syncing: this.queue.filter(op => op.status === 'syncing').length,
      failed: this.queue.filter(op => op.status === 'failed').length
    };
  }
}
```

### 9.3.2 Conflict Resolution Strategies

```typescript
// shared/offline-sync/ConflictResolver.ts

/**
 * Conflict Resolution Strategies
 */

export enum ConflictStrategy {
  LAST_WRITE_WINS = 'last-write-wins',
  SERVER_WINS = 'server-wins',
  CLIENT_WINS = 'client-wins',
  MANUAL_MERGE = 'manual-merge',
  AUTO_MERGE = 'auto-merge'
}

export interface Conflict {
  resource: string;
  resourceId: string;
  clientVersion: any;
  serverVersion: any;
  clientTimestamp: number;
  serverTimestamp: number;
}

export class ConflictResolver {
  /**
   * Resolve conflict using specified strategy
   */
  static resolve(
    conflict: Conflict,
    strategy: ConflictStrategy
  ): {
    resolved: any;
    strategy: ConflictStrategy;
    action: string;
  } {
    switch (strategy) {
      case ConflictStrategy.LAST_WRITE_WINS:
        return this.lastWriteWins(conflict);
        
      case ConflictStrategy.SERVER_WINS:
        return {
          resolved: conflict.serverVersion,
          strategy,
          action: 'Server version accepted'
        };
        
      case ConflictStrategy.CLIENT_WINS:
        return {
          resolved: conflict.clientVersion,
          strategy,
          action: 'Client version accepted'
        };
        
      case ConflictStrategy.AUTO_MERGE:
        return this.autoMerge(conflict);
        
      case ConflictStrategy.MANUAL_MERGE:
        throw new Error('Manual merge requires user intervention');
        
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
  
  /**
   * Last-write-wins strategy
   */
  private static lastWriteWins(conflict: Conflict): {
    resolved: any;
    strategy: ConflictStrategy;
    action: string;
  } {
    if (conflict.clientTimestamp > conflict.serverTimestamp) {
      return {
        resolved: conflict.clientVersion,
        strategy: ConflictStrategy.LAST_WRITE_WINS,
        action: 'Client version is newer'
      };
    } else {
      return {
        resolved: conflict.serverVersion,
        strategy: ConflictStrategy.LAST_WRITE_WINS,
        action: 'Server version is newer'
      };
    }
  }
  
  /**
   * Auto-merge strategy (field-level merge)
   */
  private static autoMerge(conflict: Conflict): {
    resolved: any;
    strategy: ConflictStrategy;
    action: string;
  } {
    const merged = { ...conflict.serverVersion };
    const changedFields: string[] = [];
    
    // Merge client changes that don't conflict
    for (const [key, clientValue] of Object.entries(conflict.clientVersion)) {
      if (key === 'id' || key === 'updatedAt') continue;
      
      const serverValue = conflict.serverVersion[key];
      
      // If server hasn't changed this field, apply client change
      if (this.isEqual(serverValue, clientValue)) {
        continue; // No conflict, values are the same
      }
      
      // If client changed but server didn't, apply client change
      // (This would require original version to detect)
      // For simplicity, use last-write-wins for this field
      if (conflict.clientTimestamp > conflict.serverTimestamp) {
        merged[key] = clientValue;
        changedFields.push(key);
      }
    }
    
    return {
      resolved: merged,
      strategy: ConflictStrategy.AUTO_MERGE,
      action: changedFields.length > 0
        ? `Merged fields: ${changedFields.join(', ')}`
        : 'No merge needed'
    };
  }
  
  /**
   * Deep equality check
   */
  private static isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
```

---

## 🎯 PHASE 9.4: PUSH NOTIFICATIONS

**Duration**: Weeks 10-12 (15 business days)  
**Owner**: Backend Lead  
**Team**: 1 backend engineer, 2 mobile engineers, 1 QA  
**Budget**: $52,500

### 9.4.1 Push Notification Service

```typescript
// backend/src/services/PushNotificationService.ts

/**
 * Push Notification Service
 * Sends notifications to iOS (APNs) and Android (FCM)
 */

import admin from 'firebase-admin';
import apn from 'apn';

export interface PushDevice {
  userId: string;
  deviceId: string;
  platform: 'ios' | 'android';
  token: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
  category?: string;
}

export class PushNotificationService {
  private fcm: admin.messaging.Messaging;
  private apnProvider: apn.Provider;
  
  constructor() {
    // Initialize Firebase (for Android)
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    }
    this.fcm = admin.messaging();
    
    // Initialize APNs (for iOS)
    this.apnProvider = new apn.Provider({
      token: {
        key: process.env.APNS_KEY_PATH!,
        keyId: process.env.APNS_KEY_ID!,
        teamId: process.env.APNS_TEAM_ID!
      },
      production: process.env.NODE_ENV === 'production'
    });
  }
  
  /**
   * Register device for push notifications
   */
  async registerDevice(device: Omit<PushDevice, 'createdAt' | 'updatedAt' | 'enabled'>): Promise<void> {
    const db = getDatabase();
    
    await db.query(`
      INSERT INTO push_devices (user_id, device_id, platform, token, enabled, created_at, updated_at)
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())
      ON CONFLICT (device_id)
      DO UPDATE SET
        token = EXCLUDED.token,
        updated_at = NOW()
    `, [device.userId, device.deviceId, device.platform, device.token]);
    
    logger.info('Push device registered', {
      userId: device.userId,
      deviceId: device.deviceId,
      platform: device.platform
    });
  }
  
  /**
   * Send notification to user
   */
  async sendToUser(
    userId: string,
    notification: PushNotification
  ): Promise<{
    sent: number;
    failed: number;
  }> {
    // Get user's devices
    const devices = await this.getUserDevices(userId);
    
    const results = await Promise.allSettled(
      devices.map(device => this.sendToDevice(device, notification))
    );
    
    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    logger.info('Push notifications sent', {
      userId,
      sent,
      failed,
      total: devices.length
    });
    
    return { sent, failed };
  }
  
  /**
   * Send notification to specific device
   */
  private async sendToDevice(
    device: PushDevice,
    notification: PushNotification
  ): Promise<void> {
    if (!device.enabled) {
      throw new Error('Device notifications disabled');
    }
    
    if (device.platform === 'android') {
      await this.sendFCM(device, notification);
    } else if (device.platform === 'ios') {
      await this.sendAPNs(device, notification);
    } else {
      throw new Error(`Unknown platform: ${device.platform}`);
    }
  }
  
  /**
   * Send via Firebase Cloud Messaging (Android)
   */
  private async sendFCM(
    device: PushDevice,
    notification: PushNotification
  ): Promise<void> {
    const message: admin.messaging.Message = {
      token: device.token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data,
      android: {
        priority: 'high',
        notification: {
          sound: notification.sound || 'default',
          channelId: 'default'
        }
      }
    };
    
    try {
      await this.fcm.send(message);
    } catch (error: any) {
      // Handle invalid token
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        await this.removeDevice(device.deviceId);
      }
      throw error;
    }
  }
  
  /**
   * Send via Apple Push Notification service (iOS)
   */
  private async sendAPNs(
    device: PushDevice,
    notification: PushNotification
  ): Promise<void> {
    const apnNotification = new apn.Notification({
      alert: {
        title: notification.title,
        body: notification.body
      },
      sound: notification.sound || 'default',
      badge: notification.badge,
      category: notification.category,
      payload: notification.data,
      topic: process.env.APNS_BUNDLE_ID!
    });
    
    const result = await this.apnProvider.send(apnNotification, device.token);
    
    // Handle failures
    if (result.failed.length > 0) {
      const failure = result.failed[0];
      
      // Remove invalid tokens
      if (failure.status === '410' || failure.status === '400') {
        await this.removeDevice(device.deviceId);
      }
      
      throw new Error(`APNs failed: ${failure.status} - ${failure.response.reason}`);
    }
  }
  
  /**
   * Get user's registered devices
   */
  private async getUserDevices(userId: string): Promise<PushDevice[]> {
    const db = getDatabase();
    
    const result = await db.query(`
      SELECT * FROM push_devices
      WHERE user_id = $1 AND enabled = true
    `, [userId]);
    
    return result.rows;
  }
  
  /**
   * Remove invalid device
   */
  private async removeDevice(deviceId: string): Promise<void> {
    const db = getDatabase();
    
    await db.query(`
      UPDATE push_devices
      SET enabled = false, updated_at = NOW()
      WHERE device_id = $1
    `, [deviceId]);
    
    logger.info('Push device removed (invalid token)', { deviceId });
  }
  
  /**
   * Send notification to all users (broadcast)
   */
  async broadcast(notification: PushNotification): Promise<{
    sent: number;
    failed: number;
  }> {
    const db = getDatabase();
    
    // Get all enabled devices
    const result = await db.query(`
      SELECT DISTINCT user_id FROM push_devices
      WHERE enabled = true
    `);
    
    const userIds = result.rows.map(row => row.user_id);
    
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendToUser(userId, notification))
    );
    
    const totals = results.reduce(
      (acc, result) => {
        if (result.status === 'fulfilled') {
          acc.sent += result.value.sent;
          acc.failed += result.value.failed;
        }
        return acc;
      },
      { sent: 0, failed: 0 }
    );
    
    logger.info('Broadcast sent', {
      totalUsers: userIds.length,
      ...totals
    });
    
    return totals;
  }
}
```

---

This completes Phase 9 sections 9.2-9.4. Let me create Phase 10 and 11 in the next file.