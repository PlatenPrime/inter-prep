# Q033. Что такое `IndexedDB` в браузере? Преимущества `IndexedDB`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**IndexedDB** — встроенная в браузер **асинхронная** NoSQL-база на стороне клиента: хранилища объектов (object stores), ключи, индексы, транзакции. Работает в main thread и в **Web Workers**; объём — сотни МБ и больше (по quota). Преимущества перед localStorage: большой объём, структурированные данные, индексы, бинарные типы (`Blob`, `ArrayBuffer`), не блокирует UI при правильном API.

---

## Развёрнутый ответ

### Суть и определение

IndexedDB — не SQL: модель **ключ–значение** с object stores внутри **database** (имя + version). Версионирование через `onupgradeneeded` при `open()`. Спецификация W3C; поддержка во всех современных браузерах.

Часть экосистемы **офлайн-first**: вместе с Service Worker и Cache API.

### Как это работает

1. `indexedDB.open('myApp', 2)` — если version выше, срабатывает upgrade (создание stores, индексов).
2. Транзакции **readonly** или **readwrite** на один или несколько stores.
3. Запросы через `IDBRequest` (callback) или обёртки **idb**, **Dexie.js**.
4. Курсоры для обхода больших наборов без загрузки всего в память.

Данные привязаны к origin; удаляются при «Clear site data».

### Практика и применение

- **Офлайн-каталог, почта, заметки** — кэш сущностей с индексом по `updatedAt`.
- **Загрузка файлов с возобновлением** — хранение чанков Blob.
- **PWA** — синхронизация при появлении сети (Background Sync).

Без IndexedDB большие массивы в localStorage блокируют поток и упираются в квоту.

### Важные нюансы и краеугольные камни

- Нативный API **многословный** — в проде часто Dexie/localforage.
- Транзакции **короткие**; долгие блокируют другие операции.
- **Safari private mode** — ограничения и эфемерность.
- Не замена серверной БД: нет multi-user, backup, сложных JOIN.
- Миграции схемы — только в `onupgradeneeded`, планировать version bump.

### Примеры

```javascript
import { openDB } from 'idb';

const db = await openDB('shop', 1, {
  upgrade(db) {
    const store = db.createObjectStore('products', { keyPath: 'id' });
    store.createIndex('by-category', 'category');
  },
});

await db.put('products', { id: 1, name: 'Phone', category: 'tech' });
const item = await db.get('products', 1);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **IndexedDB vs localStorage?** — размер, async, индексы, типы.
- **IndexedDB vs Cache API?** — объекты vs HTTP Response, разные задачи.
- **Как узнать quota?** — `navigator.storage.estimate()`.
- **Работа в Worker?** — да, для тяжёлого парсинга без блокировки UI.
- **Конфликты при sync?** — стратегии last-write-wins, versioning, CRDT на уровне приложения.

### Красные флаги (чего не говорить)

- «IndexedDB — это SQL» или «реляционная БД в браузере».
- Синхронные циклы `open`/`transaction` в hot path без обёрток.
- «Данные никогда не пропадут» — пользователь может очистить storage.

### Связанные темы

- [031-web-storage.md](031-web-storage.md)
- [032-raznica-cookie-session-local.md](032-raznica-cookie-session-local.md)
- [035-service-workers.md](035-service-workers.md)
- [044-pwa.md](044-pwa.md)

---
