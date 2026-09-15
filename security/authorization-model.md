# DayNight Pilot — Authorization & Tenant Scoping Specification

## 1. Authorization Pipeline

```
Request
  │
  ▼
Authentication Check (requireAuthentication)
  │
  ▼
Resolve User & Workspace Membership (requireWorkspaceMembership)
  │
  ▼
Evaluate Role Capability (requirePermission)
  │
  ▼
Verify Resource Ownership (requireWorkspaceResource)
  │
  ▼
Execute Scoped Database Operation (scopedDb)
```

## 2. Role Capability Matrix

| Permission | OWNER | ADMIN | MANAGER | MEMBER | VIEWER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `application:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `application:create` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `application:update` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `application:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `member:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `ai:approve` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workspace:export` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `audit:read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workspace:settings` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `billing:manage` | ✅ | ❌ | ❌ | ❌ | ❌ |
