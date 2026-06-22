# Git — теория для junior (10 вопросов)

> **Уровень:** начальный опыт (clone → commit → push → branch → PR).  
> **Не нужно сейчас:** cherry-pick, reflog — см. [day-01](../../days/day-01-web-platform-git/) после штурма.

---

## Q1. [RU] Зачем нужен Git?

**Answer (EN):**  
Git is a distributed version control system — it tracks file changes over time, lets teams work in parallel on branches, review code before merging, and roll back mistakes. Every developer has a full copy of history locally.

---

## Q2. [RU] Базовый workflow: от clone до push?

**Answer (EN):**  
1. `git clone <url>` — copy remote repo  
2. `git status` — see changed/untracked files  
3. `git add <file>` or `git add .` — stage changes  
4. `git commit -m "message"` — save snapshot locally  
5. `git push` — send commits to remote (e.g. GitHub)  
6. Open Pull Request for team review before merging to main

**Red flags:** Committing without reading `git status`; huge vague messages like «fix»

---

## Q3. [RU] Что такое staging area (index)?

**Answer (EN):**  
The staging area is where you prepare the next commit. `git add` moves changes into staging; `git commit` records only staged changes. Lets you split work into logical commits — stage some files, commit, stage the rest.

---

## Q4. [RU] Ветки — зачем и как создать?

**Answer (EN):**  
Branches isolate work — feature/fix without touching `main`. Create and switch: `git switch -c feature/login` (or older `git checkout -b`). Work, commit, push branch, open PR. `main` stays stable; features merge when ready.

---

## Q5. [RU] `git pull` — что происходит?

**Answer (EN):**  
`git pull` fetches remote changes and integrates them into your current branch — typically `fetch` + `merge`. Run before starting work and before push to avoid conflicts. `git pull --rebase` replays your commits on top of remote — cleaner history on feature branches (team policy dependent).

---

## Q6. [RU] Merge vs rebase — концепт для junior?

**Answer (EN):**  
**Merge** combines branches with a merge commit — preserves full branch history. **Rebase** replays your commits on another base — linear history, but rewrites SHAs. Rule: merge or rebase feature into main per team rules; don't rebase shared/pushed history without coordination.

**Углубление:** [days/day-01 questions/git-workflow.md](../../days/day-01-web-platform-git/questions/git-workflow.md)

---

## Q7. [RU] Merge conflict — что делать?

**Answer (EN):**  
Happens when two branches edit the same lines. Git marks conflicts in files with `<<<<<<<`, `=======`, `>>>>>>>`. Open file, choose correct code (or combine), remove markers, `git add` resolved files, `git commit` to finish merge. Ask teammate if unsure whose change to keep.

**Red flags:** Panic; committing conflict markers; force push to «fix»

---

## Q8. [RU] `.gitignore` — зачем?

**Answer (EN):**  
Lists files Git should never track — `node_modules/`, `.env`, build output `dist/`, OS files `.DS_Store`. Keeps repo small, avoids leaking secrets, prevents noise in diffs. Create `.gitignore` before first commit on new projects.

---

## Q9. [RU] Pull Request (PR) — зачем в команде?

**Answer (EN):**  
A PR proposes merging your branch into main. Teammates review code, suggest improvements, run CI tests. It's collaboration + quality gate — not just bureaucracy. Addresses criteria: teamwork, initiative (clear description), learning from feedback.

---

## Q10. [RU] Что НЕ коммитить?

**Answer (EN):**  
Secrets (API keys, passwords), `node_modules`, large binaries, personal IDE settings (unless team agrees), generated build artifacts. If committed secrets — rotate keys immediately; consider `git filter-repo` with senior help.

---

## Устные сценарии (ответь вслух)

### Сценарий 1
**[RU]** Ты сделал изменения, но забыл в каких файлах. Что сделаешь?  
**Answer (EN):** Run `git status` and `git diff` to see unstaged changes; `git diff --staged` for staged.

### Сценарий 2
**[RU]** Коллега сказал, что твой push сломал main. Ты только что запушил один коммит.  
**Answer (EN):** Don't force push. Check CI/logs, reproduce locally, fix in a new commit or revert commit (`git revert`), push fix, communicate in team chat.

### Сценарий 3
**[RU]** Нужно начать задачу «добавить форму логина». С чего начнёшь в Git?  
**Answer (EN):** `git switch main`, `git pull`, `git switch -c feature/login-form`, implement, commit small logical chunks, push, open PR with description and screenshots.

### Сценарий 4
**[RU]** `git commit` без `git add` — что случится?  
**Answer (EN):** Nothing new is committed if nothing is staged — Git may say «no changes added to commit». Must `git add` first (or `git commit -am` only for already tracked files).

---

## Шпаргалка команд

| Команда | Действие |
|---------|----------|
| `git status` | Что изменилось |
| `git add .` | Stage всех изменений |
| `git commit -m "..."` | Локальный коммит |
| `git push -u origin branch` | Первый push ветки |
| `git switch -c name` | Новая ветка |
| `git log --oneline -5` | Последние 5 коммитов |
| `git pull` | Подтянуть remote |
