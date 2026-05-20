# Q012. Разница между протоколами `TCP` и `UDP`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**TCP** — надёжный, с установлением соединения, с **гарантией порядка** и повторной передачей потерянных пакетов; подходит для HTTP, HTTPS, SSH. **UDP** — без соединения, **без гарантии доставки и порядка**, меньше overhead и задержка; используют для DNS, VoIP, видеостриминга, игр, а также как основа **QUIC/HTTP/3**. TCP жертвует latency ради надёжности; UDP — наоборот, надёжность строят на уровне приложения при необходимости.

---

## Развёрнутый ответ

### Суть и определение

Оба — транспортный уровень (L4). IP доставляет пакеты хосту; TCP/UDP мультиплексируют **порты** для процессов.

### Как это работает

**TCP:**

- 3-way handshake, flow control (окно), congestion control (Cubic, BBR)
- Поток байтов без границ сообщений — приложение читает stream
- Head-of-line blocking внутри потока

**UDP:**

- Datagram — граница сообщения сохраняется
- Нет retransmit на уровне UDP
- Broadcast/multicast (ограниченно в современных сетях)

**В вебе:** HTTP/1–2 → TCP; HTTP/3 → QUIC поверх UDP; DNS часто UDP (с fallback TCP для больших ответов).

### Практика и применение

- API REST — TCP (TLS).
- **WebRTC** — UDP для медиа, TCP для signaling.
- **gRPC streaming** — TCP.
- Мониторинг: retransmits, RTT на TCP; packet loss на UDP VoIP.

### Важные нюансы и краеугольные камни

- «UDP всегда быстрее» — на потерянных каналах приложению нужны свои ретраи (QUIC).
- **Firewall** блокирует UDP — HTTP/3 fallback на TCP.
- **MTU / fragmentation** — большие UDP без PMTUD проблемны.
- Путать **надёжность QUIC** с «голым UDP».

### Примеры

```javascript
// Node: TCP — http server
import http from 'node:http';
http.createServer((req, res) => res.end('ok')).listen(3000);

// Node: UDP — dgram (низкоуровневый datagram)
import dgram from 'node:dgram';
const sock = dgram.createSocket('udp4');
sock.send(Buffer.from('ping'), 53, '8.8.8.8');
```

---

## Сравнение

| Критерий | TCP | UDP |
|----------|-----|-----|
| Соединение | Да (handshake) | Нет |
| Надёжность | Гарантированная доставка | Best effort |
| Порядок пакетов | Да | Нет |
| Overhead | Выше (заголовок, ACK) | Ниже |
| Head-of-line blocking | Да (в потоке) | Нет между datagram |
| Типичный веб-стек | HTTP/1.1, HTTP/2 | HTTP/3 (QUIC), DNS |
| Use case | Файлы, API, страницы | Real-time, QUIC |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему HTTP/3 на UDP?** — QUIC в userspace, per-stream recovery.
- **Когда DNS по TCP?** — ответ > 512 bytes, truncation.
- **Что такое QUIC?** — надёжность как TCP + мультиплексирование.
- **TCP HOL vs UDP?** — объяснить на примере HTTP/2 vs HTTP/3.
- **WebSocket transport?** — TCP.

### Красные флаги (чего не говорить)

- «UDP никогда не используют в продакшене» — DNS, QUIC, RTC.
- «TCP и UDP на одном порту 80» — порты разделяют сервисы; 80 обычно TCP HTTP.
- Путать **IP** с TCP/UDP.

### Связанные темы

- `011-trehstoronnee-rukopozhatie.md`, `009-http3.md`
- `013-osi-model.md`, `014-ip-adres.md`
