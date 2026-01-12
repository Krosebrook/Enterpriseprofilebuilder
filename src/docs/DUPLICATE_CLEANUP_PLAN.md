# Duplicate Component Structure Cleanup Plan

## Issue
The codebase has duplicate directory structures:
- Root level: `/components`, `/features`, `/lib`, etc.
- `/src` directory: `/src/components`, `/src/features`, `/src/lib`, etc.

This creates confusion and potential bugs from importing the wrong version.

## Analysis

### Duplicate Directories Found:
1. `/components` vs `/src/components`
2. `/features` vs `/src/features`
3. `/lib` vs `/src/lib`
4. `/hooks` vs `/src/hooks`
5. `/contexts` vs `/src/contexts`
6. `/types` vs `/src/types`
7. `/utils` vs `/src/utils`

### Recommendation: Use ROOT Level

The root-level structure should be the source of truth because:
1. Current imports in main files (App.tsx, ContentViewer.tsx) use root-level
2. Root has more comprehensive implementation
3. Simpler import paths (no `/src` prefix needed)

## Migration Steps (FUTURE TASK)

### Phase 1: Audit (1 day)
1. Search all files for imports from `/src/`
2. Document which files are only in `/src` and need to be moved
3. Identify any unique logic in `/src` versions

### Phase 2: Move Unique Files (1 day)
```bash
# Example: If /src/lib/api/claude-client.ts is unique
mv /src/lib/api/claude-client.ts /lib/api/claude-client.ts
```

### Phase 3: Update Imports (1 day)
Use find-and-replace to update all imports:
- `from '../src/components/` → `from '../components/`
- `from './src/lib/` → `from './lib/`
- etc.

### Phase 4: Delete /src Directory (after testing)
```bash
rm -rf /src
```

## Current Workaround

For this refactoring, we're:
1. Using root-level components as canonical
2. Not modifying /src directory
3. Documenting for future cleanup

## Files to Keep an Eye On

### Potentially Unique in /src:
- `/src/lib/api/claude-client.ts` - May have updates not in root
- `/src/features/operations/hooks/useROICalculator.ts` - Hook that might be unique
- `/src/docs/*.md` - Documentation that might not exist at root

## Testing After Cleanup
- [ ] All imports resolve correctly
- [ ] No runtime errors
- [ ] All features work as expected
- [ ] Build succeeds
- [ ] Tests pass
