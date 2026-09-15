/**
 * DayNight Pilot — SCIM 2.0 User Provisioning Engine
 * P6-04: Implements RFC 7643 & RFC 7644 SCIM 2.0 standard protocol
 * for automated identity synchronization with Okta, Azure AD, and OneLogin.
 */

import { logger } from '../logger';

export interface ScimUser {
  schemas: string[];
  id: string;
  userName: string;
  name?: {
    formatted?: string;
    familyName?: string;
    givenName?: string;
  };
  displayName?: string;
  emails: Array<{
    value: string;
    primary: boolean;
    type?: string;
  }>;
  active: boolean;
  organizationId: string;
  meta: {
    resourceType: 'User';
    created: string;
    lastModified: string;
    location: string;
  };
}

const IN_MEMORY_SCIM_USERS = new Map<string, ScimUser>();

/**
 * Lists SCIM users for an organization with pagination.
 */
export async function listScimUsers(params: {
  organizationId: string;
  startIndex?: number;
  count?: number;
  filter?: string;
}): Promise<{
  schemas: string[];
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  Resources: ScimUser[];
}> {
  const users = Array.from(IN_MEMORY_SCIM_USERS.values()).filter(
    (u) => u.organizationId === params.organizationId
  );

  const startIndex = params.startIndex || 1;
  const count = params.count || 50;
  const paged = users.slice(startIndex - 1, startIndex - 1 + count);

  return {
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: users.length,
    startIndex,
    itemsPerPage: paged.length,
    Resources: paged
  };
}

/**
 * Creates / provisions a new SCIM user.
 */
export async function createScimUser(params: {
  organizationId: string;
  userName: string;
  givenName?: string;
  familyName?: string;
  displayName?: string;
  email: string;
  active?: boolean;
}): Promise<ScimUser> {
  const id = `usr_scim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const user: ScimUser = {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
    id,
    userName: params.userName,
    displayName: params.displayName || `${params.givenName || ''} ${params.familyName || ''}`.trim() || params.userName,
    name: {
      givenName: params.givenName,
      familyName: params.familyName,
      formatted: `${params.givenName || ''} ${params.familyName || ''}`.trim()
    },
    emails: [
      {
        value: params.email,
        primary: true,
        type: 'work'
      }
    ],
    active: params.active !== false,
    organizationId: params.organizationId,
    meta: {
      resourceType: 'User',
      created: now,
      lastModified: now,
      location: `/api/v1/scim/Users/${id}`
    }
  };

  IN_MEMORY_SCIM_USERS.set(id, user);
  logger.info({ id, userName: user.userName, organizationId: params.organizationId }, 'SCIM user provisioned.');
  return user;
}

/**
 * Updates / suspends an existing SCIM user.
 */
export async function updateScimUser(
  id: string,
  organizationId: string,
  updates: Partial<Pick<ScimUser, 'active' | 'name' | 'displayName'>>
): Promise<ScimUser | null> {
  const user = IN_MEMORY_SCIM_USERS.get(id);
  if (!user || user.organizationId !== organizationId) {
    return null;
  }

  if (typeof updates.active === 'boolean') {
    user.active = updates.active;
  }
  if (updates.name) {
    user.name = { ...user.name, ...updates.name };
  }
  if (updates.displayName) {
    user.displayName = updates.displayName;
  }

  user.meta.lastModified = new Date().toISOString();
  logger.info({ id, active: user.active }, 'SCIM user status updated.');
  return user;
}
