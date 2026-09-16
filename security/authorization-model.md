# DayNight Pilot — Authorization & Multi-Tenant Scoping Specification

## 1. Centralized Authorization Architecture

Authorization in DayNight Pilot is strictly server-side. Frontend role or permission checks exist solely for UI presentation (hiding buttons, disabling inputs) and never determine security access.

### The 7-Step Authorization Pipeline:

```
Request (with headers)
  │
  ▼
1. Authentication (requireAuthentication)
   - Validates session token, expiration, revocation.
  │
  ▼
2. User Resolution
   - Resolves authenticated userId from session context.
  │
  ▼
3. Workspace Resolution
   - Resolves target workspaceId from route or body.
  │
  ▼
4. Membership Verification
   - Queries Membership table for (userId, organizationId).
  │
  ▼
5. Permission Evaluation (hasPermission)
   - Checks role capability against requested action.
  │
  ▼
6. Resource Ownership (checkResourceBelongsToWorkspace)
   - Confirms target resourceId belongs to workspaceId.
  │
  ▼
7. Scoped Database Operation (ScopedDb)
   - Executes query filtered by workspaceId and deletedAt: null.
```

---

## 2. Role-Based Access Control (RBAC) Hierarchy

The platform defines 5 explicit roles:
1. **OWNER**: Organization creator; full control over billing, memberships, integrations, and deletion.
2. **ADMIN**: Organization administrator; can manage members, settings, and workflows; cannot transfer ownership or cancel primary subscription.
3. **MANAGER**: Operational supervisor; can manage applications, approve AI suggestions, and view audit logs; cannot modify org settings or members.
4. **MEMBER**: Standard collaborative user; can view, create, and update application entities; cannot delete applications, access audit logs, or manage billing.
5. **VIEWER**: Read-only auditor/guest; can view permitted workspace dashboards; cannot mutate any application data.

---

## 3. Comprehensive Permission Matrix

| Capability / Permission | OWNER | ADMIN | MANAGER | MEMBER | VIEWER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `application:read` (`view_applications`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `application:create` (`edit_applications`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| `application:update` (`edit_applications`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| `application:delete` (`delete_applications`) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `member:manage` (`manage_users`) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `ai:approve` (`manage_workspace`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workspace:export` (`export_workspace`) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `audit:read` (`view_audit_logs`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| `workspace:settings` (`manage_workspace`) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `billing:manage` (`manage_billing`) | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Multi-Tenant Data Scoping (`ScopedDb`)

All entity queries pass through `ScopedDb` (`web/src/lib/security/scopedDb.ts`). This guarantees:
- Every query automatically injects `where: { workspaceId, deletedAt: null }`.
- Mutation methods check `requireWorkspaceResource()` prior to execution.
- Soft deletes are standard (`deletedAt: new Date()`), preserving historical audit records.

```typescript
const scopedDb = new ScopedDb(session.userId, session.workspaceId);
const application = await scopedDb.getApplicationById(applicationId);
```

---

## 5. Privilege Escalation Defenses & Test Coverage

1. **Vertical Privilege Escalation**:
   - Prevention: `hasPermission(role, permission)` prevents lower-tier roles (MEMBER, VIEWER) from invoking administrative or billing capabilities.
   - Test: `tests/security/authorization/role-matrix.test.ts`.

2. **Horizontal Privilege Escalation (BOLA)**:
   - Prevention: `checkResourceBelongsToWorkspace` verifies that `resourceId` belongs to `session.workspaceId`. Attempting to access another workspace's resource yields 403 Forbidden.
   - Test: `tests/security/tenancy/cross-tenant-read.test.ts`.

3. **AI Self-Authorization Prevention**:
   - Prevention: AI agents only output proposed tool invocations. The server-side Tool Firewall independently verifies the caller's session permissions before execution. AI claims of authorization are ignored.
   - Test: `tests/security/authorization/ai-self-grant.test.ts`.
