# Q004. Недостатки паттерна `MVW`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**MVW (Model-View-Whatever)** — ироничный термин, обозначающий семейство паттернов MVC/MVP/MVVM, где "Whatever" подчёркивает, что их реализации часто расходятся с теорией. Общие недостатки: **Massive Controller/Presenter/ViewModel** при росте сложности, **размытые границы** между слоями, **сложность двустороннего потока данных**, избыточный **boilerplate** и **плохая масштабируемость** при росте команды или числа экранов.

---

## Развёрнутый ответ

### Суть и определение

Термин «MVW» ввёл Igor Minar (команда AngularJS) в 2012 году, признав, что Angular не является строго MVC, MVP или MVVM — это «что-то своё». С тех пор MVW используется как обобщённое название этих паттернов.

Основные проблемы обнаруживаются по мере роста приложения:

### Проблема 1: Massive Controller / Presenter / ViewModel

Самый распространённый антипаттерн — «толстый» промежуточный слой:

```typescript
// Антипаттерн: Massive ViewModel — 500+ строк
class ProductPageViewModel {
  // Состояние списка товаров
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';
  isLoading = false;

  // Состояние корзины
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  isCartOpen = false;

  // Состояние авторизации
  currentUser: User | null = null;
  isAuthModalOpen = false;

  // Состояние отзывов
  reviews: Review[] = [];
  isReviewFormOpen = false;

  // ...ещё 300 строк методов
}
```

**Решение:** разбить на атомарные stores / sub-ViewModels / slice.

### Проблема 2: Двусторонний поток данных — сложность отладки

В классическом MVVM/MVC данные могут течь в обоих направлениях:

```
View → ViewModel → Model → ViewModel → View
  ↑___________________________|
```

При нескольких View/Controller, читающих одну Model, возникает **race condition** и **неочевидное обновление состояния**. Вопрос «почему обновился этот компонент?» становится сложным.

```typescript
// Проблема: два компонента меняют один объект
class SharedCartModel {
  items: CartItem[] = [];
}

// Компонент A обновляет
cartModel.items.push(newItem);

// Компонент B тоже обновляет асинхронно
setTimeout(() => cartModel.items.splice(0, 1), 100);

// Итог: непредсказуемое состояние, трудно дебаггировать
```

**Решение:** однонаправленный поток данных (Flux/Redux).

### Проблема 3: Размытые границы слоёв

В реальных проектах граница между слоями стирается:

```typescript
// Нарушение: бизнес-логика в Controller/ViewModel
class OrderController {
  async createOrder(req: Request) {
    // Здесь в Controller — логика скидок, налогов, инвентаря
    const discount = req.user.isPremium ? 0.1 : 0;
    const tax = req.body.items.reduce((sum, i) => sum + i.price * 0.2, 0);
    const total = req.body.items.reduce((sum, i) => sum + i.price, 0) * (1 - discount) + tax;
    // ... всё это должно быть в OrderModel/OrderService
  }
}
```

### Проблема 4: Тестируемость View

В MVC View сложно тестировать изолированно — требует полный рендеринг, имитацию событий. Проблема усиливается при tight coupling View → Controller.

### Проблема 5: Boilerplate и сложность масштабирования

MVP в особенности страдает от избыточного количества кода: для каждого экрана — интерфейс View, Presenter, Mock для тестов:

```typescript
// Для одного экрана нужно:
interface IUserProfileView { ... }   // 10+ методов
class UserProfilePresenter { ... }   // 200+ строк
class MockUserProfileView { ... }    // ещё 50 строк для тестов
```

### Что предлагается взамен

| Проблема MVW | Решение |
|---|---|
| Massive Controller | Feature Slices, Vertical Slice Architecture |
| Двунаправленный поток | Flux / Redux / однонаправленный поток |
| Плохая масштабируемость | Micro Frontends, Domain-Driven Design |
| Boilerplate MVP | MVVM с Observables, React Hooks |
| Размытые слои | Clean Architecture (Hexagonal) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React перешёл к однонаправленному потоку?** — для предсказуемости: состояние → UI, действие → новое состояние. Проблема MVC — View может менять Model напрямую.
- **Что такое "Massive ViewController" в iOS?** — та же болезнь: UIViewController берёт на себя сеть, навигацию, анимации. Решение — VIPER или Clean Swift.
- **Как Feature Slices решают Massive Controller?** — каждый фичевый модуль изолирован: свои компоненты, store slice, API-слой; нет общего «бога».
- **Почему двусторонняя привязка данных усложняет дебаггинг?** — цепочка изменений непредсказуема; инструменты вроде Redux DevTools невозможны при mutable двустороннем потоке.

### Красные флаги (чего не говорить)

- «MVW-паттерны устарели, надо использовать только Redux» — паттерны применимы в разных контекстах; Redux тоже не серебряная пуля.
- «Проблемы MVW решаются добавлением ещё одного слоя» — лишние абстракции ухудшают ситуацию; нужно упрощение, а не усложнение.

### Связанные темы

- `001-chto-takoe-mvc.md`, `002-chto-takoe-mvvm.md`, `003-chto-takoe-mvp.md`
- `008-odnonapravlennyy-potok-vs-dvustoronnyaya-svyaz.md`, `009-chto-takoe-flux.md`
