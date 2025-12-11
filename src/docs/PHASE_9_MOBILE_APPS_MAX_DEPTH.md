# PHASE 9: MOBILE APPS & CROSS-PLATFORM EXPANSION

**INT Inc Enterprise Claude Profile Builder**  
**Production-Grade Mobile Implementation - Maximum Depth**

---

## 📊 Phase 9 Overview

**Duration**: 16 weeks (Q3 2026, July - October 2026)  
**Team Size**: 15 people (3 iOS, 3 Android, 2 React Native, 2 backend, 2 QA, 1 designer, 1 DevOps, 1 PM)  
**Budget**: $280,000  
**Prerequisites**: Phase 8 complete, API endpoints stable, design system finalized  
**Owner**: VP Engineering + Mobile Lead

### Strategic Objectives

1. **Native Mobile Apps**: iOS (SwiftUI) and Android (Jetpack Compose) with full feature parity
2. **Offline-First Architecture**: Work seamlessly without internet connection
3. **Real-Time Sync**: Background sync with conflict resolution
4. **Mobile-Optimized UX**: Touch-first interactions, gestures, platform conventions
5. **Push Notifications**: Real-time alerts for important events
6. **Performance**: 60fps animations, <100ms response time, <50MB app size

### Success Metrics (OKRs)

| Objective | Key Results | Baseline | Target | Measurement |
|-----------|-------------|----------|--------|-------------|
| **App Adoption** | Mobile DAU/MAU ratio | 0% | 40% | Analytics |
| | App Store rating | N/A | 4.5+ stars | Reviews |
| | Mobile sessions per user | N/A | 15/week | Analytics |
| **Performance** | App startup time | N/A | <1.5s | Metrics |
| | Time to interactive | N/A | <2s | Metrics |
| | Battery usage per hour | N/A | <5% | Device metrics |
| **User Satisfaction** | Mobile NPS | N/A | 60+ | Survey |
| | Task completion rate | N/A | 85%+ | Analytics |
| | Crash-free rate | N/A | 99.9% | Crashlytics |

---

## 🎯 PHASE 9.1: MOBILE ARCHITECTURE & FOUNDATION

**Duration**: Weeks 1-3 (15 business days)  
**Owner**: Mobile Lead + Backend Lead  
**Team**: 2 iOS, 2 Android, 2 backend, 1 DevOps  
**Budget**: $52,500

### 9.1.1 Mobile-First API Design

#### Implementation

```typescript
// backend/src/api/mobile/v1/routes.ts

/**
 * Mobile-Optimized API Endpoints
 * Designed for bandwidth efficiency, offline support, and mobile use cases
 */

import { Router } from 'express';
import { authenticate, rateLimit } from '@/middleware';
import { MobileController } from './MobileController';

const router = Router();

// ═══════════════════════════════════════════════════════════
// Mobile-Specific Endpoints
// ═══════════════════════════════════════════════════════════

/**
 * Sync endpoint - Delta sync for efficient data transfer
 * Only returns data changed since last sync
 */
router.post('/sync',
  authenticate,
  rateLimit({ windowMs: 60000, max: 60 }), // 60 requests per minute
  MobileController.sync
);

/**
 * Batch operations - Reduce number of requests
 */
router.post('/batch',
  authenticate,
  rateLimit({ windowMs: 60000, max: 30 }),
  MobileController.batch
);

/**
 * Compressed responses - Reduce bandwidth
 */
router.get('/compressed/:resource',
  authenticate,
  MobileController.compressed
);

/**
 * Push notification registration
 */
router.post('/push/register',
  authenticate,
  MobileController.registerPushToken
);

/**
 * Background sync - For offline changes
 */
router.post('/background-sync',
  authenticate,
  MobileController.backgroundSync
);

export default router;

// ═══════════════════════════════════════════════════════════
// Mobile Controller Implementation
// ═══════════════════════════════════════════════════════════

import { Request, Response } from 'express';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

export class MobileController {
  /**
   * Delta sync - Only return changes since last sync
   */
  static async sync(req: Request, res: Response) {
    try {
      const { lastSyncTimestamp, deviceId, resources } = req.body;
      const userId = req.user!.id;
      
      // Get changes since last sync
      const changes = await MobileSyncService.getChanges({
        userId,
        deviceId,
        lastSyncTimestamp,
        resources
      });
      
      // Track sync metrics
      await AnalyticsService.track({
        userId,
        event: 'mobile_sync',
        properties: {
          deviceId,
          changesCount: changes.total,
          syncDuration: changes.duration
        }
      });
      
      res.json({
        success: true,
        timestamp: Date.now(),
        changes,
        nextSyncRecommended: Date.now() + 300000 // 5 minutes
      });
      
    } catch (error) {
      logger.error('Mobile sync failed', error);
      res.status(500).json({
        success: false,
        error: 'Sync failed',
        retryAfter: 60000 // Retry after 1 minute
      });
    }
  }
  
  /**
   * Batch operations - Execute multiple operations in one request
   */
  static async batch(req: Request, res: Response) {
    try {
      const { operations } = req.body;
      const userId = req.user!.id;
      
      // Validate batch size
      if (operations.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 50 operations per batch'
        });
      }
      
      // Execute operations
      const results = await Promise.allSettled(
        operations.map((op: BatchOperation) => 
          MobileBatchService.executeOperation(userId, op)
        )
      );
      
      // Format results
      const response = results.map((result, index) => ({
        operationId: operations[index].id,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
      
      res.json({
        success: true,
        results: response,
        executed: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length
      });
      
    } catch (error) {
      logger.error('Batch operation failed', error);
      res.status(500).json({ success: false, error: 'Batch failed' });
    }
  }
  
  /**
   * Compressed responses - Reduce bandwidth usage
   */
  static async compressed(req: Request, res: Response) {
    try {
      const { resource } = req.params;
      const userId = req.user!.id;
      
      // Get resource data
      const data = await MobileDataService.getResource(userId, resource);
      
      // Compress data
      const jsonData = JSON.stringify(data);
      const compressed = await gzipAsync(jsonData);
      
      // Set headers
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Original-Size', jsonData.length.toString());
      res.setHeader('X-Compressed-Size', compressed.length.toString());
      res.setHeader('X-Compression-Ratio', 
        (compressed.length / jsonData.length * 100).toFixed(2) + '%'
      );
      
      res.send(compressed);
      
    } catch (error) {
      logger.error('Compression failed', error);
      res.status(500).json({ success: false, error: 'Compression failed' });
    }
  }
  
  /**
   * Register push notification token
   */
  static async registerPushToken(req: Request, res: Response) {
    try {
      const { token, platform, deviceId } = req.body;
      const userId = req.user!.id;
      
      await PushNotificationService.registerDevice({
        userId,
        deviceId,
        platform, // 'ios' | 'android'
        token
      });
      
      res.json({
        success: true,
        message: 'Push token registered'
      });
      
    } catch (error) {
      logger.error('Push token registration failed', error);
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }
  
  /**
   * Background sync - Process offline changes
   */
  static async backgroundSync(req: Request, res: Response) {
    try {
      const { changes, deviceId } = req.body;
      const userId = req.user!.id;
      
      // Process offline changes
      const results = await OfflineSyncService.processChanges({
        userId,
        deviceId,
        changes
      });
      
      res.json({
        success: true,
        processed: results.processed,
        conflicts: results.conflicts,
        errors: results.errors
      });
      
    } catch (error) {
      logger.error('Background sync failed', error);
      res.status(500).json({ success: false, error: 'Sync failed' });
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Mobile Sync Service
// ═══════════════════════════════════════════════════════════

interface SyncRequest {
  userId: string;
  deviceId: string;
  lastSyncTimestamp: number;
  resources: string[]; // ['bookmarks', 'preferences', 'analytics']
}

interface SyncChanges {
  bookmarks: {
    added: any[];
    updated: any[];
    deleted: string[];
  };
  preferences: {
    updated: any;
  };
  analytics: {
    events: any[];
  };
  total: number;
  duration: number;
}

class MobileSyncService {
  static async getChanges(request: SyncRequest): Promise<SyncChanges> {
    const startTime = performance.now();
    
    const changes: SyncChanges = {
      bookmarks: { added: [], updated: [], deleted: [] },
      preferences: { updated: null },
      analytics: { events: [] },
      total: 0,
      duration: 0
    };
    
    // Get bookmarks changes
    if (request.resources.includes('bookmarks')) {
      const bookmarkChanges = await this.getBookmarkChanges(
        request.userId,
        request.lastSyncTimestamp
      );
      changes.bookmarks = bookmarkChanges;
      changes.total += bookmarkChanges.added.length + 
                       bookmarkChanges.updated.length + 
                       bookmarkChanges.deleted.length;
    }
    
    // Get preferences changes
    if (request.resources.includes('preferences')) {
      const preferencesChanges = await this.getPreferencesChanges(
        request.userId,
        request.lastSyncTimestamp
      );
      if (preferencesChanges) {
        changes.preferences.updated = preferencesChanges;
        changes.total += 1;
      }
    }
    
    // Get analytics events to upload
    if (request.resources.includes('analytics')) {
      // Mobile app should upload analytics, not download
      changes.analytics.events = [];
    }
    
    changes.duration = performance.now() - startTime;
    
    return changes;
  }
  
  private static async getBookmarkChanges(
    userId: string,
    since: number
  ): Promise<{ added: any[]; updated: any[]; deleted: string[] }> {
    const db = getDatabase();
    
    // Get added bookmarks
    const added = await db.query(`
      SELECT * FROM bookmarks
      WHERE user_id = $1 
        AND created_at > to_timestamp($2 / 1000.0)
        AND deleted_at IS NULL
    `, [userId, since]);
    
    // Get updated bookmarks
    const updated = await db.query(`
      SELECT * FROM bookmarks
      WHERE user_id = $1 
        AND updated_at > to_timestamp($2 / 1000.0)
        AND created_at <= to_timestamp($2 / 1000.0)
        AND deleted_at IS NULL
    `, [userId, since]);
    
    // Get deleted bookmarks
    const deleted = await db.query(`
      SELECT id FROM bookmarks
      WHERE user_id = $1 
        AND deleted_at > to_timestamp($2 / 1000.0)
    `, [userId, since]);
    
    return {
      added: added.rows,
      updated: updated.rows,
      deleted: deleted.rows.map(r => r.id)
    };
  }
  
  private static async getPreferencesChanges(
    userId: string,
    since: number
  ): Promise<any | null> {
    const db = getDatabase();
    
    const result = await db.query(`
      SELECT * FROM user_preferences
      WHERE user_id = $1 
        AND updated_at > to_timestamp($2 / 1000.0)
    `, [userId, since]);
    
    return result.rows[0] || null;
  }
}

// ═══════════════════════════════════════════════════════════
// Offline Sync Service (Conflict Resolution)
// ═══════════════════════════════════════════════════════════

interface OfflineChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: any;
  timestamp: number;
  clientId: string;
}

interface ConflictResolution {
  strategy: 'last-write-wins' | 'server-wins' | 'client-wins' | 'merge';
}

class OfflineSyncService {
  static async processChanges(request: {
    userId: string;
    deviceId: string;
    changes: OfflineChange[];
  }): Promise<{
    processed: number;
    conflicts: Array<{ changeId: string; resolution: string }>;
    errors: Array<{ changeId: string; error: string }>;
  }> {
    const results = {
      processed: 0,
      conflicts: [],
      errors: []
    };
    
    for (const change of request.changes) {
      try {
        // Check for conflicts
        const conflict = await this.detectConflict(request.userId, change);
        
        if (conflict) {
          // Resolve conflict
          const resolution = await this.resolveConflict(
            request.userId,
            change,
            conflict
          );
          
          results.conflicts.push({
            changeId: change.id,
            resolution: resolution.strategy
          });
        } else {
          // Apply change
          await this.applyChange(request.userId, change);
        }
        
        results.processed++;
        
      } catch (error) {
        logger.error('Failed to process offline change', error, { change });
        results.errors.push({
          changeId: change.id,
          error: (error as Error).message
        });
      }
    }
    
    return results;
  }
  
  private static async detectConflict(
    userId: string,
    change: OfflineChange
  ): Promise<any | null> {
    // Check if server version is newer than client version
    const db = getDatabase();
    
    const result = await db.query(`
      SELECT * FROM ${change.resource}
      WHERE id = $1 AND user_id = $2
    `, [change.data.id, userId]);
    
    if (result.rows.length === 0) {
      return null; // No conflict, resource doesn't exist
    }
    
    const serverVersion = result.rows[0];
    const serverTimestamp = new Date(serverVersion.updated_at).getTime();
    
    if (serverTimestamp > change.timestamp) {
      return serverVersion; // Conflict: server version is newer
    }
    
    return null; // No conflict
  }
  
  private static async resolveConflict(
    userId: string,
    clientChange: OfflineChange,
    serverVersion: any
  ): Promise<ConflictResolution> {
    // Default: Last-write-wins (server wins if timestamps are close)
    const timeDiff = Math.abs(
      new Date(serverVersion.updated_at).getTime() - clientChange.timestamp
    );
    
    if (timeDiff < 1000) {
      // Changes within 1 second - server wins
      return { strategy: 'server-wins' };
    }
    
    // Apply client change (client made change while offline)
    await this.applyChange(userId, clientChange);
    
    return { strategy: 'client-wins' };
  }
  
  private static async applyChange(
    userId: string,
    change: OfflineChange
  ): Promise<void> {
    const db = getDatabase();
    
    switch (change.type) {
      case 'create':
        await db.query(`
          INSERT INTO ${change.resource} (id, user_id, data, created_at)
          VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))
        `, [change.data.id, userId, change.data, change.timestamp]);
        break;
        
      case 'update':
        await db.query(`
          UPDATE ${change.resource}
          SET data = $1, updated_at = to_timestamp($2 / 1000.0)
          WHERE id = $3 AND user_id = $4
        `, [change.data, change.timestamp, change.data.id, userId]);
        break;
        
      case 'delete':
        await db.query(`
          UPDATE ${change.resource}
          SET deleted_at = to_timestamp($1 / 1000.0)
          WHERE id = $2 AND user_id = $3
        `, [change.timestamp, change.data.id, userId]);
        break;
    }
  }
}
```

### 9.1.2 iOS App Architecture (SwiftUI)

```swift
// ios/ClaudeProfileBuilder/Architecture/AppArchitecture.swift

/**
 * iOS App Architecture
 * Clean Architecture + MVVM pattern
 */

import SwiftUI
import Combine

// ═══════════════════════════════════════════════════════════
// MARK: - Clean Architecture Layers
// ═══════════════════════════════════════════════════════════

/*
┌─────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  Views (SwiftUI)                              │  │
│  │  - HomeView, ChatView, BookmarksView          │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  ViewModels (ObservableObject)                │  │
│  │  - HomeViewModel, ChatViewModel               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              DOMAIN LAYER                            │
│  ┌───────────────────────────────────────────────┐  │
│  │  Use Cases                                    │  │
│  │  - FetchBookmarksUseCase                      │  │
│  │  - SendMessageUseCase                         │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Entities                                     │  │
│  │  - Bookmark, Message, User                    │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              DATA LAYER                              │
│  ┌───────────────────────────────────────────────┐  │
│  │  Repositories                                 │  │
│  │  - BookmarkRepository                         │  │
│  │  - MessageRepository                          │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Data Sources                                 │  │
│  │  - RemoteDataSource (API)                     │  │
│  │  - LocalDataSource (CoreData)                 │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════
// MARK: - Domain Layer (Entities)
// ═══════════════════════════════════════════════════════════

struct Bookmark: Identifiable, Codable {
    let id: String
    let title: String
    let url: String
    let category: String
    let tags: [String]
    let createdAt: Date
    let updatedAt: Date
}

struct Message: Identifiable, Codable {
    let id: String
    let role: MessageRole
    let content: String
    let timestamp: Date
    var isStreaming: Bool = false
    
    enum MessageRole: String, Codable {
        case user
        case assistant
        case system
    }
}

struct Conversation: Identifiable, Codable {
    let id: String
    let title: String
    var messages: [Message]
    let createdAt: Date
    let updatedAt: Date
}

// ═══════════════════════════════════════════════════════════
// MARK: - Domain Layer (Use Cases)
// ═══════════════════════════════════════════════════════════

protocol UseCase {
    associatedtype Input
    associatedtype Output
    
    func execute(input: Input) async throws -> Output
}

// Fetch Bookmarks Use Case
struct FetchBookmarksUseCase: UseCase {
    typealias Input = Void
    typealias Output = [Bookmark]
    
    private let repository: BookmarkRepository
    
    init(repository: BookmarkRepository) {
        self.repository = repository
    }
    
    func execute(input: Void) async throws -> [Bookmark] {
        return try await repository.fetchBookmarks()
    }
}

// Send Message Use Case
struct SendMessageUseCase: UseCase {
    typealias Input = (conversationId: String, message: String)
    typealias Output = AsyncThrowingStream<String, Error>
    
    private let repository: MessageRepository
    
    init(repository: MessageRepository) {
        self.repository = repository
    }
    
    func execute(input: Input) async throws -> AsyncThrowingStream<String, Error> {
        return try await repository.sendMessage(
            conversationId: input.conversationId,
            message: input.message
        )
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Data Layer (Repositories)
// ═══════════════════════════════════════════════════════════

protocol BookmarkRepository {
    func fetchBookmarks() async throws -> [Bookmark]
    func addBookmark(_ bookmark: Bookmark) async throws
    func deleteBookmark(id: String) async throws
    func syncBookmarks() async throws
}

class BookmarkRepositoryImpl: BookmarkRepository {
    private let remoteDataSource: RemoteDataSource
    private let localDataSource: LocalDataSource
    private let syncService: SyncService
    
    init(
        remoteDataSource: RemoteDataSource,
        localDataSource: LocalDataSource,
        syncService: SyncService
    ) {
        self.remoteDataSource = remoteDataSource
        self.localDataSource = localDataSource
        self.syncService = syncService
    }
    
    func fetchBookmarks() async throws -> [Bookmark] {
        // Try local first (offline-first)
        let localBookmarks = try await localDataSource.fetchBookmarks()
        
        // Sync in background
        Task {
            try? await syncBookmarks()
        }
        
        return localBookmarks
    }
    
    func addBookmark(_ bookmark: Bookmark) async throws {
        // Save locally first
        try await localDataSource.saveBookmark(bookmark)
        
        // Sync to server in background
        Task {
            try? await remoteDataSource.addBookmark(bookmark)
        }
    }
    
    func deleteBookmark(id: String) async throws {
        // Delete locally first
        try await localDataSource.deleteBookmark(id: id)
        
        // Sync to server in background
        Task {
            try? await remoteDataSource.deleteBookmark(id: id)
        }
    }
    
    func syncBookmarks() async throws {
        let lastSyncTime = UserDefaults.standard.double(forKey: "lastBookmarkSync")
        
        // Get changes from server
        let changes = try await syncService.sync(
            resource: "bookmarks",
            since: lastSyncTime
        )
        
        // Apply changes locally
        for bookmark in changes.added {
            try await localDataSource.saveBookmark(bookmark)
        }
        
        for bookmark in changes.updated {
            try await localDataSource.updateBookmark(bookmark)
        }
        
        for id in changes.deleted {
            try await localDataSource.deleteBookmark(id: id)
        }
        
        // Update last sync time
        UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "lastBookmarkSync")
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Data Layer (Data Sources)
// ═══════════════════════════════════════════════════════════

protocol RemoteDataSource {
    func fetchBookmarks() async throws -> [Bookmark]
    func addBookmark(_ bookmark: Bookmark) async throws
    func deleteBookmark(id: String) async throws
}

class RemoteDataSourceImpl: RemoteDataSource {
    private let apiClient: APIClient
    
    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }
    
    func fetchBookmarks() async throws -> [Bookmark] {
        let response: APIResponse<[Bookmark]> = try await apiClient.request(
            endpoint: "/api/mobile/v1/bookmarks",
            method: .get
        )
        return response.data
    }
    
    func addBookmark(_ bookmark: Bookmark) async throws {
        let _: APIResponse<Bookmark> = try await apiClient.request(
            endpoint: "/api/mobile/v1/bookmarks",
            method: .post,
            body: bookmark
        )
    }
    
    func deleteBookmark(id: String) async throws {
        let _: APIResponse<Void> = try await apiClient.request(
            endpoint: "/api/mobile/v1/bookmarks/\(id)",
            method: .delete
        )
    }
}

protocol LocalDataSource {
    func fetchBookmarks() async throws -> [Bookmark]
    func saveBookmark(_ bookmark: Bookmark) async throws
    func updateBookmark(_ bookmark: Bookmark) async throws
    func deleteBookmark(id: String) async throws
}

class LocalDataSourceImpl: LocalDataSource {
    private let coreDataService: CoreDataService
    
    init(coreDataService: CoreDataService) {
        self.coreDataService = coreDataService
    }
    
    func fetchBookmarks() async throws -> [Bookmark] {
        return try await coreDataService.fetch(entity: BookmarkEntity.self)
            .map { $0.toDomain() }
    }
    
    func saveBookmark(_ bookmark: Bookmark) async throws {
        let entity = BookmarkEntity.from(bookmark)
        try await coreDataService.save(entity)
    }
    
    func updateBookmark(_ bookmark: Bookmark) async throws {
        try await coreDataService.update(
            entity: BookmarkEntity.self,
            id: bookmark.id,
            updates: { entity in
                entity.title = bookmark.title
                entity.url = bookmark.url
                entity.updatedAt = bookmark.updatedAt
            }
        )
    }
    
    func deleteBookmark(id: String) async throws {
        try await coreDataService.delete(entity: BookmarkEntity.self, id: id)
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Presentation Layer (ViewModels)
// ═══════════════════════════════════════════════════════════

@MainActor
class BookmarksViewModel: ObservableObject {
    @Published var bookmarks: [Bookmark] = []
    @Published var isLoading = false
    @Published var error: Error?
    
    private let fetchBookmarksUseCase: FetchBookmarksUseCase
    private var cancellables = Set<AnyCancellable>()
    
    init(fetchBookmarksUseCase: FetchBookmarksUseCase) {
        self.fetchBookmarksUseCase = fetchBookmarksUseCase
    }
    
    func loadBookmarks() async {
        isLoading = true
        error = nil
        
        do {
            bookmarks = try await fetchBookmarksUseCase.execute(input: ())
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Presentation Layer (Views)
// ═══════════════════════════════════════════════════════════

struct BookmarksView: View {
    @StateObject private var viewModel: BookmarksViewModel
    
    init(viewModel: BookmarksViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading {
                    ProgressView()
                } else if let error = viewModel.error {
                    ErrorView(error: error) {
                        Task {
                            await viewModel.loadBookmarks()
                        }
                    }
                } else {
                    List(viewModel.bookmarks) { bookmark in
                        BookmarkRow(bookmark: bookmark)
                    }
                }
            }
            .navigationTitle("Bookmarks")
            .task {
                await viewModel.loadBookmarks()
            }
        }
    }
}

struct BookmarkRow: View {
    let bookmark: Bookmark
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(bookmark.title)
                .font(.headline)
            
            Text(bookmark.url)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack {
                ForEach(bookmark.tags, id: \.self) { tag in
                    Text(tag)
                        .font(.caption2)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - Dependency Injection
// ═══════════════════════════════════════════════════════════

class DependencyContainer {
    static let shared = DependencyContainer()
    
    // Core services
    lazy var apiClient: APIClient = APIClientImpl()
    lazy var coreDataService: CoreDataService = CoreDataServiceImpl()
    lazy var syncService: SyncService = SyncServiceImpl(apiClient: apiClient)
    
    // Data sources
    lazy var remoteDataSource: RemoteDataSource = RemoteDataSourceImpl(apiClient: apiClient)
    lazy var localDataSource: LocalDataSource = LocalDataSourceImpl(coreDataService: coreDataService)
    
    // Repositories
    lazy var bookmarkRepository: BookmarkRepository = BookmarkRepositoryImpl(
        remoteDataSource: remoteDataSource,
        localDataSource: localDataSource,
        syncService: syncService
    )
    
    // Use cases
    lazy var fetchBookmarksUseCase: FetchBookmarksUseCase = FetchBookmarksUseCase(
        repository: bookmarkRepository
    )
    
    // View models
    func makeBookmarksViewModel() -> BookmarksViewModel {
        BookmarksViewModel(fetchBookmarksUseCase: fetchBookmarksUseCase)
    }
}

// ═══════════════════════════════════════════════════════════
// MARK: - App Entry Point
// ═══════════════════════════════════════════════════════════

@main
struct ClaudeProfileBuilderApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}
```

**Deliverables for 9.1**:
- ✅ Mobile-optimized API endpoints with delta sync
- ✅ iOS app architecture (Clean Architecture + MVVM)
- ✅ Offline-first data layer with conflict resolution
- ✅ Dependency injection container
- ✅ Core Data setup for local storage

---

Continuing with 9.2-9.5 in next response (Android implementation, offline sync, push notifications, app store deployment)...