Got it. I’ll (1) read `README_REFRACTORING_PLAN.md` + `README.md` to understand intended architecture, (2) scan the repo for duplicate/archived components and dead code paths, then (3) propose a tight refactor/removal list (what to delete, what to merge, and what imports/routes need updating). Since I’m in **Ask mode**, I’ll give you exact file/folder deletions and patch-style guidance for you to apply (or you can switch to **Code mode** and I can do it). I’m going to start by reading the two READMEs and mapping the codebase hotspots.

You’re right — my last `grep_search` used a regex with bad escape sequences. I’ll re-run those searches using **literal string matching** (`FixedStrings: true`) so it can’t choke on the quotes/escapes, then I’ll continue the repo scan for the biggest redundancy targets ([\_ARCHIVE](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0), duplicate error boundaries, leftover Bulma classes, and repeated loading/error patterns).

# Findings (what’s actually redundant right now)

## 1) [src/\_ARCHIVE/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) is huge and not referenced by runtime code

- **Evidence**
  - Searches for [\_ARCHIVE](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) imports from active code came back **empty**.
  - Most Bulma-class hits (`has-text-`, `notification is-`, etc.) are **inside [\_ARCHIVE](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0)**.
- **What this means**
  - [\_ARCHIVE](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) is safe to remove _from the shipped app_ as long as you don’t rely on it for reference.
- **Recommended action**
  1. **Move [src/\_ARCHIVE/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) out of [src/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src:0:0-0:0)** into something like `/_archive_src/` (repo root) _or_ delete it.
  2. If you want it kept for reference, keeping it **outside [src](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src:0:0-0:0)** avoids bundler/typecheck noise and makes “dead code” obvious.

## 2) You currently have **three different “ErrorBoundary” concepts**

This is real duplication and it’s confusing:

- **[src/components/global/AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0)**
  - Uses `react-error-boundary`
  - Still contains **Bulma** classes (`container is-fluid`, `notification is-danger`, `button is-danger`, etc.)
  - **Used by [src/index.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/index.tsx:0:0-0:0)** (so this is the “real” global boundary right now)

- **[src/components/error/ErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/error/ErrorBoundary.tsx:0:0-0:0)**
  - A **class-based** boundary (custom)
  - Used by [src/services/errorReporting.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/services/errorReporting.ts:0:0-0:0) in the [withErrorBoundary](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/services/errorReporting.ts:85:0-104:2) HOC
  - Has a bunch of reporting logic + TODOs

- **[src/components/shared/ErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:0:0-0:0)**
  - Not a React error boundary; it’s an **error UI component + helper hook** ([useDataQueryHandler](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:68:0-80:2))
  - Name overlaps with the other two, causing mental overhead

### Recommended action (minimal-risk, cleanest)

Pick **one global error boundary** approach and delete/rename the rest.

My recommendation:

1. **Keep `react-error-boundary`** (already in deps, simple, reliable).
2. **Replace Bulma UI in [AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0)** with DaisyUI/Tailwind equivalents (same behavior, cleaner styling consistency).
3. **Rename [src/components/shared/ErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:0:0-0:0)** to something like:
   - `src/components/shared/QueryState.tsx` or `src/components/shared/QueryFeedback.tsx`
   - And rename its exports accordingly ([ErrorBoundary](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:18:0-40:2) → `ErrorAlert` / `QueryError`, [DataValidator](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:42:0-66:2) → `NullDataAlert`, etc.)
4. Either:
   - **Delete** [src/components/error/ErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/error/ErrorBoundary.tsx:0:0-0:0) + refactor [errorReporting.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/services/errorReporting.ts:0:0-0:0) to wrap with `react-error-boundary`, **or**
   - Keep it, but then stop using [AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0) (not recommended since index.tsx already uses it).

If you want the _least churn_: keep [AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0), and refactor [errorReporting.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/services/errorReporting.ts:0:0-0:0) to stop importing the class-based boundary.

## 3) Bulma isn’t fully eradicated in active code (README claims 100%)

Two active files clearly still have Bulma patterns:

- **[src/components/global/AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0)** (Bulma)
- **[src/components/export/DataExport.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/export/DataExport.tsx:0:0-0:0)** (Bulma: `notification is-warning`, `card-content`, `button is-primary`, etc.)
- **[src/components/charts/KillChart.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/charts/KillChart.tsx:0:0-0:0)** also includes Bulma (`title is-5`, `notification is-info`, etc.)

### Recommended action

- **Convert those remaining Bulma classes** to DaisyUI/Tailwind.
- This is not “new features”, it’s cleanup to match README + your refactor plan.

## 4) Loading state consolidation is partially done, but not enforced

- You already have [src/components/shared/LoadingState.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:0:0-0:0).
- Yet components still inline spinners:
  - [KillChart.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/charts/KillChart.tsx:0:0-0:0) returns a raw `<span className="loading ...">...`
  - [SearchWithSuggestions.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/SearchWithSuggestions.tsx:0:0-0:0) has its own loading UI block
- [AppRoutes.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/routes/AppRoutes.tsx:0:0-0:0) already uses [LoadingStateCentered](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:27:0-39:2) correctly (good).

### Recommended action

- Replace remaining inline spinners with:
  - [LoadingState](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:8:0-25:2)
  - [LoadingStateInline](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:41:0-54:2)
  - [LoadingStateCentered](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:27:0-39:2)
- This is easy, low-risk, and reduces duplication fast.

## 5) [DataExport.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/export/DataExport.tsx:0:0-0:0) exists but appears unused

- I found **no imports** like `from '@/components/export/DataExport'`.
- That suggests it’s either dead code or only used via some barrel file (none found in my scan).
- It also still uses Bulma, which is another clue it’s leftover.

### Recommended action

- Confirm usage:
  1. Search for `<DataExport` usage across [src/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src:0:0-0:0).
  2. If unused, **delete [src/components/export/DataExport.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/export/DataExport.tsx:0:0-0:0)**.
  3. If used, migrate it to DaisyUI/Tailwind and keep it.

## 6) [src/utils.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/utils.ts:0:0-0:0) vs [src/utils/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/utils:0:0-0:0) folder isn’t duplication, but it’s confusing naming

You have:

- [src/utils.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/utils.ts:0:0-0:0) (big grab-bag util file)
- [src/utils/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/utils:0:0-0:0) folder containing `performance.ts`, `analytics.ts`

### Recommended action

- Rename [src/utils.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/utils.ts:0:0-0:0) → `src/utils/index.ts` (or `src/utils/core.ts`)
- Then update imports like `import { questTypeIcon } from '../utils';`
- This avoids the “is utils a file or folder?” confusion.

# Concrete cleanup plan (safe order)

## Step 1 — Remove/move archive code

1. Move [src/\_ARCHIVE/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) to repo root, or delete it.
2. Run TypeScript + build.

## Step 2 — Fix the ErrorBoundary duplication

1. Keep [AppErrorBoundary](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:22:0-34:2) as the global boundary (since [index.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/index.tsx:0:0-0:0) uses it).
2. Convert its UI from Bulma → DaisyUI.
3. Rename [components/shared/ErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/ErrorBoundary.tsx:0:0-0:0) (it’s not a boundary).
4. Refactor [errorReporting.ts](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/services/errorReporting.ts:0:0-0:0) to stop using the class boundary OR remove the class boundary entirely.

## Step 3 — Kill remaining Bulma in active components

- [KillChart.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/charts/KillChart.tsx:0:0-0:0)
- [DataExport.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/export/DataExport.tsx:0:0-0:0) (or delete if unused)
- [AppErrorBoundary.tsx](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/global/AppErrorBoundary.tsx:0:0-0:0)

## Step 4 — Enforce [LoadingState](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/shared/LoadingState.tsx:8:0-25:2) reuse

Replace inline spinners with shared components.

# Verification (don’t skip)

Run:

1. `npm run lint`
2. `npm run build`
3. Smoke test routes:
   - `/`
   - `/search/:query`
   - one Character page with chart
   - one export flow (if still used)
   - trigger an error boundary (temporarily throw in a component, or simulate a render error)

# One question (so I don’t guess wrong)

Do you want to **delete** [src/\_ARCHIVE/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src/_ARCHIVE:0:0-0:0) outright, or **keep it but move it out of [src/](cci:7://file:///d:/Workshop/Dev/Github/Clones/killboard/src:0:0-0:0)** (recommended for reference)?

---

## Status

- **Refactor review done**: I found the main redundant folders/files and the highest-impact cleanups (archive, error boundary duplication, lingering Bulma, loading duplication, possibly-dead [DataExport](cci:1://file:///d:/Workshop/Dev/Github/Clones/killboard/src/components/export/DataExport.tsx:9:0-189:2)).
