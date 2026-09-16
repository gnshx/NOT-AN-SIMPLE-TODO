---
name: systematic-root-cause-debugging
description: "Forensic root-cause debugging methodology: 5-whys, isolating minimal reproductions, binary search bisecting, and regression test authoring."
category: engineering
risk: safe
tags: [debugging, root-cause, testing, troubleshooting, quality]
---

# Systematic Root-Cause Debugging

Stop guessing and shotgun debugging. Apply empirical forensic investigation to solve complex bugs permanently.

## 1. The 5-Step Diagnostic Protocol

1. **Reproduce Reliably**: Never write a fix for a bug you cannot reliably trigger. Build a minimal reproduction script or failing unit test first.
2. **Inspect the Stack & State**: Trace variables backward from the failure point to where invalid state was first introduced.
3. **Formulate a Testable Hypothesis**: "If condition X is true, then function Y receives null because Z."
4. **Isolate with Binary Search**: Use `git bisect` or component tree pruning to pinpoint the exact commit or boundary that introduced the failure.
5. **Implement & Defend**: Write the fix, verify the failing test turns green, and add a regression test so the bug can never reoccur.

## 2. Anti-Patterns to Avoid

- ❌ "Shotgun Debugging": Changing random lines of code hoping the error goes away.
- ❌ Hiding symptoms with nullish coalescing (`obj?.field ?? ''`) when `obj` being undefined represents an upstream system breakdown.
- ❌ Suppressing TypeScript errors with `any` or `@ts-ignore`.
