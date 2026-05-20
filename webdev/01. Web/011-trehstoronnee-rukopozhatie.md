# Q011. Что такое "трехстороннее рукопожатие" (Triple handshake)?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Трёхстороннее рукопожатие (TCP three-way handshake)** — процедура установки **TCP-соединения** между клиентом и сервером в три шага: **SYN** → **SYN-ACK** → **ACK**. После этого обе стороны согласовали начальные номера последовательности (ISN) и могут надёжно передавать байты. Только после TCP (и при HTTPS — после TLS) начинается HTTP. Закрытие — **четырёхстороннее** (FIN/ACK) или RST.

---

## Развёрнутый ответ

### Суть и определение

TCP — протокол с установлением соединения (connection-oriented), уровень L4 OSI. Handshake гарантирует, что обе стороны «на линии» и готовы к обмену с контролем порядка и повторной передачей.

### Как это работает

1. **Клиент → SYN** — `SYN=1`, seq=x (случайный ISN клиента), опционально window scale, SACK.
2. **Сервер → SYN-ACK** — `SYN=1, ACK=1`, seq=y, ack=x+1.
3. **Клиент → ACK** — `ACK=1`, ack=y+1. Соединение **ESTABLISHED**.

Затем для HTTPS:

4. **TLS ClientHello / ServerHello** — cipher, cert, key exchange.
5. **HTTP** — запрос поверх зашифрованного канала.

**RTT cost:** 1 RTT для TCP + 1–2 RTT для TLS 1.2; TLS 1.3 часто 1 RTT; TCP Fast Open (TFO) — редко.

### Практика и применение

- Каждый новый origin + порт = новый handshake (до keep-alive / connection pooling).
- **Latency** первой загрузки — мотивация HTTP/2 single connection, QUIC 0-RTT.
- **SYN flood** — DDoS; защита SYN cookies на firewall.
- **TIME_WAIT** — закрытые сокеты держат состояние ~2MSL; высокий churn портов на прокси.

### Важные нюансы и краеугольные камни

- Путать с **TLS handshake** или **WebSocket handshake** (HTTP Upgrade) — разные уровни.
- **Half-open** соединения при потере ACK — таймауты, ретраи SYN.
- **NAT timeout** — долгий idle разрывает TCP; keep-alive HTTP помогает.
- **QUIC** объединяет transport + crypto — не классический TCP 3-way для HTTP/3.

### Примеры

```
# TCP three-way (упрощённо)
Client                    Server
   |---- SYN seq=100 -------->|
   |<--- SYN-ACK seq=300, ack=101 --|
   |---- ACK ack=301 -------->|
   |     [ESTABLISHED]        |

# Затем TLS + HTTP
   |---- ClientHello -------->|
   |<--- ServerHello, cert ---|
   |---- Finished ----------->|
   |---- GET / HTTP/1.1 ----->|
```

```javascript
// Node: соединение создаётся при первом запросе к хосту
const agent = new https.Agent({ keepAlive: true, maxSockets: 10 });
// keepAlive переиспользует TCP+TLS session — меньше handshakes
fetch('https://api.example.com/a', { agent });
fetch('https://api.example.com/b', { agent });
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Сколько RTT до первого байта HTML?** — DNS + TCP + TLS + TTFB.
- **Чем закрывается TCP?** — FIN four-way, RST при abort.
- **SYN flood mitigation?** — SYN cookies, rate limit.
- **TCP vs UDP handshake?** — UDP connectionless, нет 3-way.
- **QUIC 0-RTT vs TCP 3-way?** — разные модели установления.

### Красные флаги (чего не говорить)

- «Трёхстороннее рукопожатие — это HTTP» — это TCP (или путают с TLS).
- «После SYN сразу идёт JSON» — сначала установление TCP, потом TLS, потом HTTP.
- Описывать только 2 шага — забыть финальный ACK клиента.

### Связанные темы

- `012-raznica-tcp-i-udp.md`, `006-raznica-http-i-https.md`
- `013-osi-model.md`, `017-mekhanizm-seansa.md`
