# Q057. Что такое «опрос» (Polling)? Как его реализовать в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Polling** — паттерн периодического запроса к серверу для получения обновлений, когда push-механизмы (WebSocket, SSE) недоступны. В React реализуется через `setInterval` внутри `useEffect` с корректным cleanup. Для production используйте TanStack Query с `refetchInterval` — он управляет интервалом, дедупликацией и background/foreground логикой.

---

## Развёрнутый ответ

### Суть и определение

Polling — клиент регулярно опрашивает сервер: «есть ли новые данные?». Это простой способ имитировать реальное время там, где нет WebSocket или SSE.

Виды polling:
- **Regular polling** — фиксированный интервал
- **Long polling** — сервер держит соединение открытым до появления данных
- **Exponential backoff polling** — интервал увеличивается при ошибках

### Базовая реализация через setInterval + useEffect

```tsx
const usePolling = <T>(
  fetchFn: () => Promise<T>,
  interval: number,
  enabled = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let isCancelled = false;

    const poll = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        if (!isCancelled) setData(result);
      } catch (err) {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    poll(); // немедленный первый запрос

    const id = setInterval(poll, interval);

    return () => {
      isCancelled = true;
      clearInterval(id); // очистка при размонтировании или смене deps
    };
  }, [fetchFn, interval, enabled]);

  return { data, error, isLoading };
};

// Использование
const StatusWidget: React.FC = () => {
  const fetchStatus = useCallback(() => fetch('/api/status').then(r => r.json()), []);
  const { data, isLoading } = usePolling(fetchStatus, 5000);

  return <div>{isLoading ? 'Обновляется...' : data?.status}</div>;
};
```

### TanStack Query — production подход

```tsx
import { useQuery } from '@tanstack/react-query';

const StatusWidget: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => fetch('/api/status').then(r => r.json()),
    refetchInterval: 5000,         // polling каждые 5 секунд
    refetchIntervalInBackground: false, // стоп при неактивной вкладке
    staleTime: 3000,               // данные актуальны 3 сек (меньше запросов)
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return <div>Статус: {data.status}</div>;
};
```

### Adaptive polling — умный интервал

```tsx
const useAdaptivePolling = <T>(
  fetchFn: () => Promise<T>,
  baseInterval: number
) => {
  const [data, setData] = useState<T | null>(null);
  const [interval, setInterval] = useState(baseInterval);
  const consecutiveErrors = useRef(0);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: number;

    const poll = async () => {
      try {
        const result = await fetchFn();
        if (!isCancelled) {
          setData(result);
          consecutiveErrors.current = 0;
          setInterval(baseInterval); // сбросить к базовому интервалу
        }
      } catch {
        consecutiveErrors.current++;
        // Exponential backoff: 5s, 10s, 20s, 40s (max 60s)
        const newInterval = Math.min(baseInterval * 2 ** consecutiveErrors.current, 60000);
        if (!isCancelled) setInterval(newInterval);
      } finally {
        if (!isCancelled) timeoutId = window.setTimeout(poll, interval);
      }
    };

    poll();
    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [fetchFn, baseInterval, interval]);

  return { data, interval };
};
```

### Polling с паузой при неактивной вкладке

```tsx
const useVisibilityPolling = <T>(fetchFn: () => Promise<T>, interval: number) => {
  const [data, setData] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!isVisible) return; // стоп при неактивной вкладке

    let isCancelled = false;
    fetchFn().then(d => { if (!isCancelled) setData(d); });
    const id = window.setInterval(() => {
      fetchFn().then(d => { if (!isCancelled) setData(d); });
    }, interval);

    return () => { isCancelled = true; clearInterval(id); };
  }, [fetchFn, interval, isVisible]);

  return data;
};
```

### Практика и применение

- **Статус задачи**: загрузка файла, обработка видео — опрашиваем каждые 2-5 сек
- **Биржевые котировки**: когда WebSocket недоступен
- **Мониторинг**: uptime статусы, health checks
- **Чат-приложения**: legacy API без WebSocket

### Важные нюансы и краеугольные камни

- **Cleanup обязателен** — иначе утечка памяти и запросы от размонтированного компонента
- **Race conditions**: несколько одновременных запросов → последний «выигрывает» (AbortController или `isCancelled` флаг)
- **Visibility API** — не тратить запросы на фоновую вкладку
- Polling хуже WebSocket по latency и нагрузке на сервер; используйте только при невозможности push

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем polling отличается от WebSocket?** — polling: клиент инициирует периодически; WebSocket: двустороннее постоянное соединение, сервер пушит данные
- **Как избежать накопления запросов?** — дождаться завершения предыдущего перед новым (sequential), или AbortController
- **Когда exponential backoff?** — при ошибках: уменьшить нагрузку при проблемах с сервером

### Красные флаги (чего не говорить)

- «setInterval без cleanup» — классическая ошибка: продолжает работать после размонтирования
- «Polling и WebSocket одинаковы» — polling: pull-модель, HTTP; WebSocket: push, постоянное соединение

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
- `032-kak-realizovat-odnokratnoe-vypolnenie-operacii-pri-nachalnom-renderinge.md`
