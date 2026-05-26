# Q025. Плюсы и минусы реактивного программирования?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Плюсы реактивного программирования: **элегантная обработка асинхронности**, автоматическая отмена, декларативная обработка потоков событий, встроенные операторы для сложных сценариев (debounce, retry, combine). Минусы: **высокий порог входа**, сложность отладки, утечки памяти при неправильной отписке, overhead для простых случаев где хватило бы Promise.

---

## Развёрнутый ответ

### Плюсы

#### 1. Элегантная работа с асинхронностью

```typescript
// ❌ Promise/async-await: много boilerplate для сложных сценариев
async function searchWithCancel(query: string) {
  const controller = new AbortController();

  // При новом вводе нужно вручную отменять предыдущий запрос
  if (currentController) currentController.abort();
  currentController = controller;

  try {
    const response = await fetch(`/search?q=${query}`, { signal: controller.signal });
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') return; // игнорируем отмену
    throw err;
  }
}

// ✅ RxJS: декларативно, без boilerplate
const results$ = searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query =>                        // автоматически отменяет предыдущий
    from(fetch(`/search?q=${query}`).then(r => r.json())).pipe(
      catchError(() => of([]))              // обработка ошибки прямо в цепочке
    )
  )
);
```

---

#### 2. Мощная комбинация потоков

```typescript
import { combineLatest, forkJoin } from 'rxjs';

// Параллельная загрузка, дождаться всех
const pageData$ = forkJoin({
  user: userService.getUser(id),
  permissions: permissionService.getPermissions(id),
  settings: settingsService.getSettings()
});

// Реакция на несколько изменяемых источников
const viewModel$ = combineLatest({
  user: currentUser$,
  filters: activeFilters$,
  sortOrder: sortOrder$
}).pipe(
  debounceTime(50),  // избегаем лишних пересчётов при batch-изменениях
  map(({ user, filters, sortOrder }) => buildViewModel(user, filters, sortOrder))
);
```

---

#### 3. Встроенный retry и error recovery

```typescript
const robustApiCall$ = http.get('/api/data').pipe(
  timeout(5000),                           // таймаут
  retry({
    count: 3,
    delay: (error, attempt) =>             // экспоненциальная задержка
      timer(Math.pow(2, attempt) * 1000)
  }),
  catchError(err => {
    logger.error('API failed', err);
    return of(defaultData);                // fallback
  })
);
```

---

#### 4. Управление ресурсами (backpressure)

```typescript
// Обработка WebSocket без перегрузки
const ws$ = webSocket('wss://api.example.com/stream');

ws$.pipe(
  bufferTime(100),                          // группируем сообщения каждые 100ms
  filter(batch => batch.length > 0),
  map(batch => processBatch(batch))
).subscribe(updateUI);
```

---

#### 5. Единообразие: всё — поток

```typescript
// HTTP-запрос, события мыши, WebSocket, таймер — единый API
const httpData$ = http.get('/api/users');
const clickEvents$ = fromEvent(button, 'click');
const socketMessages$ = webSocket('/ws');
const periodic$ = interval(1000);

// Все обрабатываются одинаково — операторы работают с любым Observable
httpData$.pipe(map(transformData)).subscribe(render);
clickEvents$.pipe(throttleTime(500)).subscribe(handleClick);
```

---

### Минусы

#### 1. Высокий порог входа

```typescript
// Код, понятный опытному, запутает новичка
const complexStream$ = merge(
  this.route.params.pipe(pluck('id')),
  this.userActions$.pipe(
    filter(a => a.type === 'RELOAD'),
    mapTo(this.currentId)
  )
).pipe(
  distinctUntilChanged(),
  switchMap(id =>
    this.userService.getUser(id).pipe(
      withLatestFrom(this.permissionService.getPerms(id)),
      map(([user, perms]) => ({ ...user, permissions: perms }))
    )
  ),
  shareReplay(1)
);
// Новичку: «Что это вообще делает?»
```

---

#### 2. Утечки памяти при неправильной отписке

```typescript
// ❌ Подписка без отписки — утечка
@Component({ template: '...' })
class BrokenComponent implements OnInit {
  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users;
    }); // ⚠️ подписка живёт вечно, даже после уничтожения компонента
  }
}

// ✅ Правильная отписка
@Component({ template: '...' })
class CorrectComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.users$.pipe(
      takeUntil(this.destroy$)          // автоотписка
    ).subscribe(users => this.users = users);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

#### 3. Сложность отладки

```typescript
// Stack traces в RxJS — глубокие и нечитаемые
// Ошибка внутри оператора map:
// at Observable._subscribe (rxjs/internal/Observable.js:42)
// at Observable.subscribe (rxjs/internal/Observable.js:31)
// at switchMap (rxjs/internal/operators/switchMap.js:...)
// ... 15+ frames

// Помощь: оператор tap для логирования промежуточных значений
observable$.pipe(
  tap(v => console.log('Before filter:', v)),
  filter(condition),
  tap(v => console.log('After filter:', v)),
  map(transform)
);
```

---

#### 4. Overhead для простых задач

```typescript
// ❌ RxJS ради одного HTTP-запроса — избыточно
const users$ = this.http.get<User[]>('/api/users').pipe(
  map(users => users.filter(u => u.active))
);

// ✅ Для простых случаев — async/await проще
const users = await fetch('/api/users').then(r => r.json());
const activeUsers = users.filter((u: User) => u.active);
```

---

### Когда реактивность оправдана

```
✅ Применять:
- Множество асинхронных источников (WebSocket + HTTP + events)
- Поиск с debounce + отменой предыдущего
- Real-time обновления, live data
- Angular (RxJS встроен повсюду)
- Сложная координация потоков данных

❌ Избегать (предпочесть Promise/async-await):
- Простые CRUD-операции
- Один HTTP-запрос
- Команда без опыта с RxJS
```

### Важные нюансы и краеугольные камни

- **Cold vs Hot Observable**: HTTP-запросы — cold (каждая подписка делает новый запрос); `shareReplay(1)` — делает hot, кэширует последний результат
- Для React — `rxjs` используется реже; есть `@tanstack/react-query` для async, `zustand` для состояния
- **Marble diagrams** — визуальный инструмент понимания и тестирования RxJS-операторов

---

## Сравнение

| Критерий | Плюс | Минус |
|----------|------|-------|
| Асинхронность | Декларативно, операторы | Сложнее Promise для простых задач |
| Отмена | Автоматически через switchMap | Нужно следить за отпиской |
| Отладка | tap-оператор | Глубокие stack traces |
| Переиспользование | Операторы — composable | Высокий порог входа |
| Ресурсы | backpressure из коробки | Потенциальные утечки |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как избежать утечек памяти в Angular с RxJS?** — `takeUntil(destroy$)` + `ngOnDestroy`, `async pipe` (автоотписка), `take(1)` для одноразовых подписок.
- **В чём разница `switchMap` vs `mergeMap` в контексте надёжности?** — switchMap отменяет in-flight запросы; при форс-мажоре (медленный backend) mergeMap может привести к race condition.
- **Что такое `shareReplay(1)` и зачем?** — Делает cold Observable горячим, кэширует последний результат — все новые подписчики получат его мгновенно. Полезно для HTTP-запросов, которые не надо дублировать.

### Красные флаги (чего не говорить)

- «RxJS — это просто Promise с операторами» — фундаментально разная модель выполнения.
- «Утечки памяти в RxJS невозможны» — очень возможны при забытых подписках.

### Связанные темы

- `024-chto-takoe-reaktivnoe-programmirovanie.md`
- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `020-raznica-oop-i-fp-v-js.md`
