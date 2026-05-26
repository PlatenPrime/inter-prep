# Q024. Что такое реактивное программирование?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Реактивное программирование** — парадигма, в которой программа реагирует на **потоки данных и событий** во времени, автоматически распространяя изменения. Ключевые концепции: Observable-потоки, подписка, операторы трансформации. В JavaScript реализуется через **RxJS** (реактивные расширения) и встроен в Angular. Основная идея: значение — не снимок, а **поток изменений** во времени.

---

## Развёрнутый ответ

### Суть и определение

```
Традиционный подход:
  const a = 1;
  const b = 2;
  const c = a + b; // c = 3, зафиксировано
  a = 5;           // c всё ещё 3

Реактивный подход (концептуально):
  a$ = Observable(1, ...) // поток значений
  b$ = Observable(2, ...)
  c$ = combineLatest([a$, b$]).pipe(map(([a, b]) => a + b))
  // c$ автоматически обновляется при изменении a$ или b$
```

Реактивность лежит в основе Excel-формул, Vue reactivity, MobX, RxJS.

---

### Observable — основа реактивного программирования

```typescript
import { Observable, Subject, BehaviorSubject, from, of, interval } from 'rxjs';
import { map, filter, debounceTime, switchMap, take } from 'rxjs/operators';

// Observable — ленивый поток данных
const numbers$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

numbers$.subscribe({
  next: value => console.log(value),     // 1, 2, 3
  error: err => console.error(err),
  complete: () => console.log('Done')
});
```

---

### Операторы — декларативная трансформация потоков

```typescript
// Цепочка операторов — как конвейер над потоком
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

const searchInput = document.getElementById('search') as HTMLInputElement;

const searchResults$ = fromEvent(searchInput, 'input').pipe(
  map(event => (event.target as HTMLInputElement).value),
  debounceTime(300),              // ждём 300ms после последнего ввода
  distinctUntilChanged(),         // не запускаем если значение не изменилось
  switchMap(query =>              // отменяем предыдущий запрос при новом вводе
    from(fetch(`/api/search?q=${query}`).then(r => r.json()))
  )
);

searchResults$.subscribe(results => renderResults(results));
```

---

### Subject и BehaviorSubject

```typescript
// Subject — и Observable, и Observer: можно подписаться + вручную эмитить
const click$ = new Subject<MouseEvent>();

document.addEventListener('click', event => click$.next(event));

click$.pipe(
  map(e => ({ x: e.clientX, y: e.clientY }))
).subscribe(pos => console.log('Clicked at:', pos));

// BehaviorSubject — хранит текущее значение, новый подписчик получает его сразу
const currentUser$ = new BehaviorSubject<User | null>(null);

currentUser$.next({ id: '1', name: 'Alice' }); // установить значение
currentUser$.getValue();                         // получить текущее без подписки

// Новый подписчик немедленно получает последнее значение
currentUser$.subscribe(user => console.log('Current user:', user));
```

---

### Ключевые операторы

```typescript
import {
  map, filter, reduce, tap,
  mergeMap, switchMap, concatMap, exhaustMap,
  combineLatest, forkJoin, zip,
  catchError, retry, timeout,
  take, takeUntil, takeWhile,
  debounceTime, throttleTime, auditTime
} from 'rxjs/operators';

// Трансформация
of(1, 2, 3).pipe(map(x => x * 2));        // 2, 4, 6
of(1, 2, 3).pipe(filter(x => x > 1));     // 2, 3

// Комбинирование потоков
const a$ = of(1);
const b$ = of(2);
combineLatest([a$, b$]).pipe(
  map(([a, b]) => a + b)
).subscribe(console.log); // 3

// Обработка ошибок
apiCall$.pipe(
  retry(3),
  catchError(err => of({ error: err.message }))
).subscribe(handleResult);

// Отмена предыдущего (критично для поиска)
// switchMap — отменяет предыдущий inner Observable
// mergeMap — выполняет параллельно, не отменяет
// concatMap — выполняет по очереди
// exhaustMap — игнорирует новые пока текущий не завершён
```

---

### Реактивность в Angular

```typescript
@Component({
  template: `
    <input [formControl]="searchControl">
    <div *ngFor="let result of results$ | async">{{ result.name }}</div>
  `
})
class SearchComponent implements OnDestroy {
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  results$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.searchService.search(query ?? '')),
    takeUntil(this.destroy$) // автоотписка при уничтожении компонента
  );

  constructor(private searchService: SearchService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

### Реактивность без RxJS: Vue Reactivity и MobX

```typescript
// Vue 3 Composition API — реактивные примитивы
import { ref, computed, watch } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2); // автоматически обновляется

watch(count, (newVal) => {
  console.log('count changed to', newVal);
});

count.value++; // doubled автоматически пересчитывается, watch срабатывает

// MobX — декларативная реактивность
import { observable, computed, action, autorun } from 'mobx';

class CartStore {
  @observable items: CartItem[] = [];

  @computed get total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  @action addItem(item: CartItem) {
    this.items.push(item);
  }
}

const cart = new CartStore();
autorun(() => console.log('Total:', cart.total)); // запускается при каждом изменении
```

### Практика и применение

- **Angular** — построен на RxJS: HTTP, FormControl, Router — всё Observable
- **Live search** — классический пример: `debounceTime + switchMap`
- **WebSocket** — RxJS `webSocket()` превращает соединение в Observable
- **State management** — NgRx (Angular Redux) на RxJS, MobX

### Важные нюансы и краеугольные камни

- **Утечки памяти**: подписки нужно отменять (`unsubscribe`, `takeUntil`, `async pipe`)
- **Cold vs Hot Observable**: cold (новый поток для каждого подписчика) vs hot (общий поток для всех)
- **Back pressure**: если данные приходят быстрее обработки — нужны `throttleTime`, `bufferTime`
- `switchMap` vs `mergeMap` — критичный выбор: поиск = `switchMap` (отмена); загрузка файлов параллельно = `mergeMap`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое холодный vs горячий Observable?** — Cold: каждый подписчик получает свой независимый поток (HTTP-запрос); Hot: все подписчики разделяют один поток (WebSocket, Subject).
- **Чем RxJS отличается от Promise?** — Promise: один результат, нет отмены, eager. Observable: поток значений, ленивый, отменяемый через `unsubscribe`.
- **Когда switchMap, когда mergeMap?** — switchMap: последнее значение важнее (поиск); mergeMap: все параллельно (независимые запросы).

### Красные флаги (чего не говорить)

- «Observable — это как Promise, только сложнее» — принципиально разная модель: поток vs одно значение.
- «RxJS нужен только в Angular» — может использоваться с React, Vue, чистым JS.

### Связанные темы

- `025-plyusy-i-minusy-reaktivnogo.md`
- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `022-imperativnyy-vs-deklarativnyy-podkhod.md`
