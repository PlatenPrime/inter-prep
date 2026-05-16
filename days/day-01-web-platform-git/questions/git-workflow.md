# Git Workflow — Interview Q&A

---

## Q1. [RU] В чём разница между `git merge` и `git rebase` на feature-ветке?

**Answer (EN):**
Merge creates a merge commit preserving branch history — safe for shared branches, shows when integration happened. Rebase replays your commits on top of another base, producing linear history — cleaner log but rewrites commit SHAs. Rule of thumb: rebase local/unpushed feature branches; never rebase commits others already pulled.

**Follow-ups:**
- What is `git pull --rebase`?
- Golden rule of rebasing?

**Red flags:**
- "Rebase and merge are the same"
- Rebasing `main` after others merged your branch without coordination

---

## Q2. [RU] Когда использовать `git cherry-pick`?

**Answer (EN):**
Cherry-pick applies a specific commit's changes onto the current branch without merging the whole branch — useful for hotfixes, backporting to release branches, or recovering a single fix from an abandoned branch. Creates a new commit with a different SHA. Watch for conflicts if context diverged.

**Follow-ups:**
- Cherry-pick vs patch file?
- Multiple commits — `cherry-pick A..B`?

**Red flags:**
- Cherry-picking large unrelated histories routinely

---

## Q3. [RU] Что такое detached HEAD и опасно ли это?

**Answer (EN):**
Detached HEAD means HEAD points to a commit, not a branch — common when checking out a tag or specific SHA. New commits aren't on any branch and can become unreachable (garbage-collected eventually). Fix: `git switch -c new-branch` to save work, or `git switch main` to return. Not dangerous if you don't commit, or if you create a branch.

**Follow-ups:**
- How does reflog help here?
- Checkout tag for debugging?

**Red flags:**
- Panic without knowing `git switch -c`

---

## Q4. [RU] Как восстановить «потерянный» коммит после ошибочного `reset --hard`?

**Answer (EN):**
Use `git reflog` — it logs where HEAD and branches pointed. Find the SHA before the reset, then `git reset --hard <sha>` or `git cherry-pick <sha>`. Reflog is local and expires (default ~90 days). For unpushed work, reflog is the primary safety net.

**Follow-ups:**
- Difference between `reset --soft/mixed/hard`?
- Can you recover after `git gc`?

**Red flags:**
- No awareness of reflog
- Using `--hard` without checking `git status`

---

## Q5. [RU] Что смотришь при code review в PR с точки зрения Git hygiene?

**Answer (EN):**
Commit messages explain why, commits are logically scoped, no secrets/large binaries, meaningful diff size, branch up to date with target, CI green, and conflict resolution doesn't hide changes. I also check if fixup commits should be squashed before merge per team policy.

**Follow-ups:**
- Squash merge vs merge commit?
- Conventional commits?

**Red flags:**
- "WIP" commits and force-push to shared branch without notice

---

## Q6. [RU] `git revert` vs `git reset` — когда что?

**Answer (EN):**
`reset` moves the branch pointer (rewrites history if pushed — needs force push, bad on shared branches). `revert` creates a new commit that undoes a specific commit — safe for public/shared history (production hotfix undo). Prefer revert on `main`; reset on local unpushed work.

**Follow-ups:**
- Revert a merge commit?
- `git restore` vs `checkout`?

**Red flags:**
- `reset --hard` on shared main to "undo release"

---

## Q7. [RU] Объясни стратегию `.gitignore` для full-stack проекта.

**Answer (EN):**
Ignore build artifacts (`dist`, `.next`), dependencies (`node_modules`), env files (`.env`, keep `.env.example`), OS/IDE files, logs, coverage. Never ignore lockfiles (`package-lock.json`). Secrets must not be committed even if ignored — use secret scanning. For monorepos, root + package-level `.gitignore` patterns.

**Follow-ups:**
- File already tracked but should be ignored?
- `git update-index --assume-unchanged`?

**Red flags:**
- Committing `.env` "just for dev"
- Ignoring `package-lock.json`
