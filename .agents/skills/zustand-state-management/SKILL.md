---
name: zustand-state-management
description: "Zustand state management standards: slice pattern, selector memoization, URL query synchronization, and avoiding React Context re-render storms."
category: frontend
risk: safe
tags: [zustand, state-management, react, performance, store]
---

# Zustand State Management Standards

High-performance client state management without prop-drilling or context re-render cascades.

## 1. Fine-Grained Selectors

Never call `useStore()` without a selector, or the component will re-render on *any* store mutation:
```tsx
// ❌ Re-renders whenever any field in store changes
const { currentView } = useUIStore();

// ✅ Re-renders ONLY when currentView strictly changes
const currentView = useUIStore((state) => state.currentView);
```

## 2. The Slices Pattern

Split monolithic stores into modular, domain-specific slices:
```ts
export const createFilterSlice: StateCreator<FilterSlice> = (set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
});
```

## 3. Syncing with URL Search Params

For filterable lists, treat URL query parameters as the source of truth, synchronizing Zustand state with `window.history.pushState` so views are bookmarkable and shareable.
