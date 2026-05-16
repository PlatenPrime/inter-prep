# Rebase & Reflog — Interview Q&A

---

## Q1. [RU] Чем rebase отличается от merge для feature branch?

**Answer (EN):**
Rebase replays commits onto new base for linear history; merge creates merge commit preserving parallel history. Rebase rewrites SHAs — don't rebase public shared branches without team agreement.

**Follow-ups:**
- interactive rebase squash?
- rerere?

**Red flags:**
- Rebase main on feature in shared repo

---

## Q2. [RU] Что такое reflog и когда спасает?

**Answer (EN):**
Reflog records where HEAD and branches pointed (local, ~90 days). Recover "lost" commits after reset --hard if not garbage-collected. git reflog then cherry-pick or reset.

**Follow-ups:**
- reflog expire?
- gc --prune?

**Red flags:**
- "reset --hard is always unrecoverable"

---

## Q3. [RU] Как работает git rebase --onto?

**Answer (EN):**
Replays commits from upstream..branch onto newbase. Useful to move feature subset. Interview: draw three branches A, B, feature.

**Follow-ups:**
- rebase --onto empty?
- orphan commits?

**Red flags:**
- Confusing onto and upstream arguments

---

## Q4. [RU] Что делать при конфликте во время rebase?

**Answer (EN):**
Fix files, git add, git rebase --continue. Or --abort to return pre-rebase. Use mergetool and understand each side (ours/theirs swaps during rebase).

**Follow-ups:**
- rerere enable?
- skip commit?

**Red flags:**
- git push -f without checking who pulled branch

---

## Q5. [RU] Чем опасен force push?

**Answer (EN):**
Overwrites remote history; teammates with old commits get duplicate/conflicts. Use --force-with-lease and branch protection on main.

**Follow-ups:**
- protected branches?
- signed commits?

**Red flags:**
- --force on main regularly

---

## Q6. [RU] git reset --soft vs --mixed vs --hard?

**Answer (EN):**
soft keeps index and working tree; mixed resets index (default); hard discards all changes to match commit. Interview tie to reflog recovery after hard reset.

**Follow-ups:**
- reset vs revert?
- revert on main policy?

**Red flags:**
- hard reset on branch others use

---

