# Bisect & Cherry-pick — Interview Q&A

---

## Q1. [RU] Как работает git bisect?

**Answer (EN):**
Binary search between good and bad commit to find regression. Mark good/bad, Git checks out middle, you test, repeat. Can automate with run script.

**Follow-ups:**
- bisect skip?
- first-parent?

**Red flags:**
- Bisect on non-linear history without mentioning merge commits

---

## Q2. [RU] Когда использовать cherry-pick?

**Answer (EN):**
Apply specific commit(s) to another branch without merging whole branch. Common for hotfix backport. Creates new SHA — watch duplicate fixes.

**Follow-ups:**
- cherry-pick range?
- -x flag audit?

**Red flags:**
- Cherry-pick instead of merge without documenting

---

## Q3. [RU] Как упорядочить cherry-pick при зависимостях?

**Answer (EN):**
Topo-sort commits by parent dependency or pick in chronological order. If A depends on B, pick B first. Tooling or custom script helps automation.

**Follow-ups:**
- patch-id?
- rebase cherry-pick?

**Red flags:**
- Pick commits in wrong order causing conflicts

---

## Q4. [RU] Что такое interactive rebase -i uses?

**Answer (EN):**
pick, squash, fixup, reword, drop, edit commits in todo list. Squash combines messages; fixup discards message. Clean history before PR.

**Follow-ups:**
- autosquash?
- exec run tests?

**Red flags:**
- Squashing everything into one commit losing bisect granularity

---

## Q5. [RU] git stash — когда и осторожности?

**Answer (EN):**
Save dirty working tree temporarily; pop may conflict. Not substitute for commits. stash -u includes untracked.

**Follow-ups:**
- stash branch?
- clear stash list?

**Red flags:**
- Stashing secrets or huge binaries

---

## Q6. [RU] Как code review связан с git hygiene?

**Answer (EN):**
Small focused commits, meaningful messages, link issue, rebase/squash per team policy, run CI before push. Reviewers read diff story.

**Follow-ups:**
- Conventional commits?
- GPG sign?

**Red flags:**
- "WIP" commit messages in merged main

---

