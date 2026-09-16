---
name: tanstack-query-patterns
description: "TanStack Query v5 (React Query) master patterns: query key factories, optimistic updates, infinite scrolling, prefetching, and mutation rollbacks."
category: frontend
risk: safe
tags: [react-query, tanstack, caching, optimistic-ui, state]
---

# TanStack Query (React Query v5) Architecture

Architecting scalable server-state management, automated background synchronization, and instant optimistic updates.

## 1. The Query Key Factory

Never scatter raw string arrays (`['jobs', id]`) across components. Use a centralized query key factory:
```ts
export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters: ApplicationFilters) => [...applicationKeys.lists(), filters] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
};
```

## 2. Optimistic Updates with Rollback

Make mutations feel instant while handling network errors gracefully:
```ts
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateJobStatus,
  onMutate: async (newStatus) => {
    await queryClient.cancelQueries({ queryKey: applicationKeys.detail(id) });
    const previous = queryClient.getQueryData(applicationKeys.detail(id));
    queryClient.setQueryData(applicationKeys.detail(id), (old) => ({ ...old, status: newStatus }));
    return { previous };
  },
  onError: (err, newStatus, context) => {
    queryClient.setQueryData(applicationKeys.detail(id), context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
  },
});
```
