---
name: atlassian-design-system
description: "Atlassian Design System: Jira/Confluence design patterns, lozenges, status badges, flags, inline messages, banner alerts, and keyboard shortcuts."
category: design-systems
risk: safe
tags: [atlassian, jira, confluence, design-system, ux]
---

# Atlassian Design System Guidelines

Atlassian Design System powers collaborative team tools with strong information scent, distinct status tracking, and distraction-free editing.

## 1. Signature UI Components

- **Lozenge**: Status indicator badges with semantic color meanings:
  - `default` (Gray): Not started, To Do, Pending
  - `inprogress` (Blue): Active, In Progress, Reviewing
  - `success` (Green): Approved, Complete, Shipped
  - `moved` (Yellow): Waiting, Blocked
  - `removed` (Red): Rejected, Cancelled, Deleted
- **Flags & Inline Messages**: Non-modal snackbar notifications that stack neatly in the bottom-left corner.
- **Banner Alerts**: Full-width top alerts for global system state (maintenance windows, trial expirations).

## 2. Interaction Ergonomics

- **Keyboard First**: Every task, ticket, and table action must have direct single-key shortcuts (`c` = create, `e` = edit, `/` = search).
- **Inline Editing**: Click-to-edit typography fields that transition seamlessly without modal disruption.
