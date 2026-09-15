# DayNight Pilot — Authentication & Authorization Model

## 1. Authorization Pipeline

```
Request
  │
  ▼
Authentication & Session Check
  │
  ▼
Resolve User & Workspace Membership
  │
  ▼
Role Permission Matrix Check (OWNER, ADMIN, MANAGER, MEMBER, VIEWER)
  │
  ▼
Resource Ownership Check (resourceId belongs to workspaceId)
  │
  ▼
Scoped DB Execution
```

## 2. Capability Matrix

| Capability | OWNER | ADMIN | MANAGER | MEMBER | VIEWER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Applications | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Applications | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete Applications | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve AI Actions | ✅ | ✅ | ✅ | ❌ | ❌ |
| Export Workspace | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Security Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Billing | ✅ | ❌ | ❌ | ❌ | ❌ |
