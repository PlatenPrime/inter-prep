# Q009. Что такое `Flux`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Flux** — архитектурный паттерн управления состоянием, предложенный Facebook в 2014 году как альтернатива MVC для React-приложений. Ключевая идея: **строго однонаправленный поток данных** через четыре компонента: `Action → Dispatcher → Store → View`. View не может изменять Store напрямую — только через Actions. Flux — паттерн, не библиотека; Redux, Zustand, MobX — его реализации и вдохновлённые им решения.

---

## Развёрнутый ответ

### Суть и определение

Facebook создал Flux, столкнувшись с «неуловимыми» багами в MVC: несколько контроллеров и Views могли изменять одну Model, создавая каскадные обновления и race conditions. Flux решил это, запретив прямые мутации Store из View.

```
                     ┌─────────────┐
                     │    View     │◄──── рендерит Store
                     └──────┬──────┘
                            │ пользователь взаимодействует
                            ▼
                     ┌─────────────┐
                     │   Action    │  { type: 'ADD_TO_CART', payload: item }
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ Dispatcher  │  единственная точка распределения
                     └──────┬──────┘
                            │ уведомляет все зарегистрированные Stores
                            ▼
                     ┌─────────────┐
                     │    Store    │  содержит состояние + логику обновления
                     └──────┬──────┘
                            │ эмитит 'change' событие
                            ▼
                     ┌─────────────┐
                     │    View     │  перерисовывается
                     └─────────────┘
```

### Четыре составляющих Flux

**1. Action** — объект, описывающий намерение изменить состояние:
```typescript
// Action Creator — функция, создающая action
const addToCart = (item: Product): CartAction => ({
  type: 'CART/ADD_ITEM',
  payload: { item },
});

const removeFromCart = (itemId: string): CartAction => ({
  type: 'CART/REMOVE_ITEM',
  payload: { itemId },
});
```

**2. Dispatcher** — единственный «хаб» для всех actions:
```typescript
import { Dispatcher } from 'flux';

// Один dispatcher на всё приложение (Singleton)
const AppDispatcher = new Dispatcher<CartAction>();

// View диспатчит — не вызывает Store напрямую
AppDispatcher.dispatch(addToCart(product));
```

**3. Store** — данные + логика их изменения, регистрирует обработчики в Dispatcher:
```typescript
import { ReduceStore } from 'flux/utils';

interface CartState {
  items: CartItem[];
  total: number;
}

class CartStore extends ReduceStore<CartState, CartAction> {
  getInitialState(): CartState {
    return { items: [], total: 0 };
  }

  reduce(state: CartState, action: CartAction): CartState {
    switch (action.type) {
      case 'CART/ADD_ITEM':
        const newItems = [...state.items, action.payload.item];
        return { items: newItems, total: calcTotal(newItems) };
      case 'CART/REMOVE_ITEM':
        const filtered = state.items.filter((i) => i.id !== action.payload.itemId);
        return { items: filtered, total: calcTotal(filtered) };
      default:
        return state;
    }
  }
}

export const cartStore = new CartStore(AppDispatcher);
```

**4. View** — подписывается на Store, диспатчит actions:
```typescript
const CartIcon: React.FC = () => {
  const [cartState, setCartState] = useState(cartStore.getState());

  useEffect(() => {
    const token = cartStore.addListener(() => {
      setCartState(cartStore.getState());
    });
    return () => token.remove();
  }, []);

  return (
    <button onClick={() => AppDispatcher.dispatch(addToCart(product))}>
      Cart ({cartState.items.length})
    </button>
  );
};
```

### От Flux к Redux

Redux — самая популярная «эволюция» Flux. Упрощения:
- Один глобальный Store вместо нескольких.
- Нет Dispatcher — store.dispatch() сам его заменяет.
- Reducer — чистая функция вместо классов.

```typescript
// Redux — «Flux без Dispatcher»
const cartReducer = (state = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART/ADD_ITEM':
      return { ...state, items: [...state.items, action.payload.item] };
    default:
      return state;
  }
};
```

### Сравнение Flux и современных альтернатив

| Аспект | Flux | Redux | Zustand | MobX |
|--------|------|-------|---------|------|
| Число Store | Несколько | Один | Несколько (модульные) | Несколько |
| Dispatcher | Явный | Встроен в store | Нет | Нет |
| Мутации | Immutable через reduce | Immutable (Immer) | Прямые (Immer) | Прямые (proxy) |
| Boilerplate | Высокий | Средний (с RTK — низкий) | Низкий | Низкий |
| Подход | Императивный | Функциональный | Функциональный | Реактивный |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Facebook отказался от MVC в пользу Flux?** — в MVC View мог напрямую изменять Model, а изменение Model триггерило обновление другой Model каскадно («хаос стрел»). Flux запрещает это.
- **Чем Redux отличается от Flux?** — одни Store vs несколько; нет явного Dispatcher; reducers вместо Store-классов; immutability в ядре.
- **Что такое «Action Creator»?** — функция, возвращающая action-объект. Обеспечивает консистентность и типобезопасность.
- **Как работает Redux Middleware?** — функция между dispatch и reducer: `store => next => action => ...`. Используется для логирования, async (redux-thunk), аналитики.

### Красные флаги (чего не говорить)

- «Flux и Redux — одно и то же» — Flux — паттерн с несколькими Stores и явным Dispatcher; Redux — конкретная библиотека, упрощающая Flux.
- «Flux устарел, используем только Hooks» — useState/useContext — для локального/простого состояния; Flux-паттерн актуален для сложных shared state-сценариев.

### Связанные темы

- `008-odnonapravlennyy-potok-vs-dvustoronnyaya-svyaz.md`
- `004-nedostatki-mvw.md`, `001-chto-takoe-mvc.md`
