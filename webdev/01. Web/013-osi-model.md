# Q013. Что такое OSI модель?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Модель OSI (Open Systems Interconnection)** — эталонная **семиуровневая** схема сетевого взаимодействия: Physical → Data Link → Network → Transport → Session → Presentation → Application. Каждый уровень решает свою задачу и обслуживает уровень выше. В реальном интернете чаще используют упрощённый стек **TCP/IP** (4–5 уровней), но OSI помогает на собеседовании **локализовать проблему** (DNS — прикладной, TLS — presentation, TCP — transport, IP — network).

---

## Развёрнутый ответ

### Суть и определение

ISO/OSI — учебная и стандартизирующая модель (не один протокол). Сравнивают с **TCP/IP model**:

| OSI | TCP/IP | Примеры |
|-----|--------|---------|
| 7 Application | Application | HTTP, DNS, SMTP |
| 6 Presentation | (в Application) | TLS encryption, JSON/XML, gzip |
| 5 Session | (в Application) | Управление сессией (часто в приложении) |
| 4 Transport | Transport | TCP, UDP |
| 3 Network | Internet | IP, ICMP, маршрутизаторы |
| 2 Data Link | Link | Ethernet, Wi‑Fi MAC |
| 1 Physical | Link | Кабель, радио |

### Как это работает

**Инкапсуляция:** HTTP-сообщение → TLS record → TCP segment → IP packet → Ethernet frame.

**Соседние уровни** общаются через интерфейсы API (сокеты BSD между app и transport).

При запросе `https://example.com`:

1. L7 — HTTP GET
2. L6 — TLS шифрует
3. L4 — TCP сегменты
4. L3 — IP маршрутизация
5. L2 — MAC на локальном сегменте
6. L1 — физическая передача

### Практика и применение

- Troubleshooting: «ping не проходит» — L3; «curl timeout» — L4/L7; «SSL error» — L6.
- **Load balancer** L4 vs L7 — TCP passthrough vs HTTP routing по path/header.
- **Firewall rules** — filtr по порту (L4) vs WAF (L7).

### Важные нюансы и краеугольные камни

- OSI **не равна** набору протоколов интернета — Session/Presentation в TCP/IP «растворены».
- **TLS** спорно относят к L6 или между L4–L7 — важна идея, не догма.
- «Уровень 8» — шутка про пользователя/оператора.
- Не путать **модель** с **реализацией** (HTTP не «весь интернет»).

### Примеры

```
# Загрузка https://api.example.com/users

[7] HTTP:  GET /users
[6] TLS:   encrypted application data
[4] TCP:   port 443, reliable stream
[3] IP:    src/dst IP, routing
[2] ETH:   MAC addresses in LAN
[1] PHY:   bits on wire / Wi-Fi radio
```

```javascript
// L7 в коде разработчика — fetch
await fetch('https://api.example.com/users');
// Ниже — ОС: DNS (L7), TCP+TLS (L4/L6), IP (L3)
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **На каком уровне HTTP?** — L7 (application).
- **Где TLS?** — presentation / между transport и application.
- **L4 vs L7 load balancer?** — IP:port vs Host, path, cookies.
- **Чем TCP/IP отличается от OSI?** — меньше уровней, практический интернет.
- **Где DNS?** — application (L7).

### Красные флаги (чего не говорить)

- Выучить уровни **без примеров протоколов**.
- «Router работает на L2» — маршрутизатор — L3; switch — L2.
- Утверждать, что **реальный стек строго 7 уровней OSI**.

### Связанные темы

- `012-raznica-tcp-i-udp.md`, `014-ip-adres.md`
- `001-chto-takoe-http.md`, `011-trehstoronnee-rukopozhatie.md`
