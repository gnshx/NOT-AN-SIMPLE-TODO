---
name: git-workflow-pro
description: "Professional Git workflows: conventional commits, clean interactive rebasing, atomic branches, clear PR descriptions, and conflict resolution."
category: devops
risk: safe
tags: [git, github, workflow, conventional-commits, engineering]
---

# Professional Git & GitHub Workflow Standards

Clean revision control habits that make collaboration, audits, and rollbacks effortless.

## 1. Conventional Commits

Format: `<type>(<scope>): <short imperative summary>`
- `feat(auth)`: Add OAuth PKCE support for Google login
- `fix(billing)`: Prevent race condition on webhook subscription renewal
- `chore(deps)`: Bump Next.js to 16.2.6
- `docs(api)`: Document cursor pagination parameters
- `perf(db)`: Add compound index on workspace applications

## 2. Atomic Commits & Branch Hygiene

- **One Logical Change per Commit**: Keep refactoring separate from feature logic and bug fixes.
- **Rebase over Merge**: Rebase feature branches on top of `main` (`git pull --rebase origin main`) to maintain a clean, linear git history.
- **Clean PR Descriptions**: Every pull request must outline:
  1. *What changed*
  2. *Why it was changed*
  3. *How it was verified (with test evidence)*
