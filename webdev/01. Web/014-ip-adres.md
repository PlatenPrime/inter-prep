# Q014. Что такое IP-адрес?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**IP-адрес (Internet Protocol address)** — числовой **идентификатор узла** в IP-сети на **сетевом уровне (L3)** для маршрутизации пакетов. **IPv4** — 32 бита (например `203.0.113.10`), **IPv6** — 128 бит (`2001:db8::1`). Публичные адреса уникальны в интернете; **приватные** диапазоны (10.0.0.0/8, 192.168.x.x) используют за NAT. DNS сопоставляет **доменное имя → IP**; один IP может обслуживать много сайтов через **virtual hosting** (Host header / SNI).

---

## Развёрнутый ответ

### Суть и определение

IP — connectionless datagram protocol. Адрес + маска подсети определяют сеть и хост. **CIDR** `/24` — гибкое деление пространства.

**Типы:**

- **Unicast** — одному получателю
- **Multicast** — группе (IPv4 IGMP)
- **Broadcast** — всем в L2 сегменте (ограничено)

### Как это работает

1. Клиент знает IP назначения (из DNS или кэша).
2. Если хост в другой подсети — пакет на **default gateway** (роутер).
3. **ARP** (IPv4) связывает IP с MAC в локальной сети.
4. Маршрутизаторы по **таблицам маршрутизации** доставляют к сети назначения.
5. **NAT** на домашнем роутере подменяет private IP → public IP.

**IPv6:** нет NAT necessity в теории, SLAAC, больше адресов; adoption растёт.

### Практика и применение

- `dig example.com A` / `AAAA` — резолв для деплоя и отладки.
- **CDN** — клиент попадает на edge IP ближайшего PoP (Anycast).
- **Firewall / Security Groups** — whitelist IP в B2B API.
- **GeoIP** — ограничение контента (compliance).
- **Docker/K8s** — pod IP vs Service ClusterIP vs Ingress.

### Важные нюансы и краеугольные камни

- **Shared IP** — различение по SNI (HTTPS) и Host (HTTP).
- **Dynamic IP** у провайдера — не полагаться на IP как единственный идентификатор пользователя.
- **127.0.0.1** — loopback; `::1` в IPv6.
- **Link-local** 169.254.x.x — APIPA при сбое DHCP.
- Путать **IP** с **MAC** (L2) или **портом** (L4).

### Примеры

```bash
# DNS → IP
nslookup api.example.com
# Address: 203.0.113.55

# Проверка маршрута
traceroute api.example.com
```

```javascript
// В Node за прокси реальный клиент — X-Forwarded-For, не socket.localAddress
app.set('trust proxy', 1);
app.get('/ip', (req, res) => {
  res.json({ clientIp: req.ip }); // express с trust proxy
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **IPv4 vs IPv6?** — размер, NAT, заголовок, adoption.
- **Что такое NAT?** — трансляция private→public, проблемы P2P.
- **Anycast?** — один IP, ближайший сервер (CDN DNS).
- **Как браузер выбирает A vs AAAA?** — Happy Eyeballs.
- **Разница IP и домена?** — Q015.

### Красные флаги (чего не говорить)

- «У каждого сайта свой уникальный IP» — virtual hosting, CDN.
- Путать **порт 443** с IP-адресом.
- «IP адрес = URL» — URL включает схему, host, path.

### Связанные темы

- `015-raznica-host-i-domain.md`, `016-raznica-uri-i-url.md`
- `013-osi-model.md`, `012-raznica-tcp-i-udp.md`
