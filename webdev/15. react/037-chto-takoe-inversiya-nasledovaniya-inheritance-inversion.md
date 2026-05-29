# Q037. Что такое инверсия наследования (Inheritance Inversion)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Инверсия наследования (Inheritance Inversion)** — один из двух паттернов реализации HOC: вместо того чтобы HOC просто оборачивал компонент, HOC **расширяет** переданный компонент (`class HOC extends WrappedComponent`). Это даёт доступ к lifecycle-методам, state и `render()` оборачиваемого компонента. Практически не используется в современном React.

---

## Развёрнутый ответ

### Суть и определение

Два паттерна HOC:
1. **Props Proxy** — HOC оборачивает компонент, управляет props (распространённый)
2. **Inheritance Inversion (II)** — HOC наследует от оборачиваемого компонента

Название «инверсия» — потому что обычно компонент наследует от React.Component, а здесь HOC наследует от самого компонента.

### Как это работает

**Props Proxy (обычный HOC):**
```tsx
function withPropsProxy<P>(WrappedComponent: React.ComponentType<P>) {
  return function HOC(props: P) {
    // HOC снаружи — получает props, передаёт вниз
    return <WrappedComponent {...props} extraProp="added" />;
  };
}
```

**Inheritance Inversion:**
```tsx
function withInheritanceInversion<P, S>(
  WrappedComponent: React.ComponentClass<P, S>
) {
  // HOC РАСШИРЯЕТ WrappedComponent — инверсия!
  return class HOC extends WrappedComponent {
    // Переопределяем render WrappedComponent
    render() {
      // Вызываем render родителя
      const originalRender = super.render();
      // Можем модифицировать
      return (
        <div className="wrapper">
          {originalRender}
        </div>
      );
    }

    // Доступ к lifecycle методам родителя
    componentDidMount() {
      super.componentDidMount?.(); // вызываем оригинальный CDM
      console.log('HOC componentDidMount');
      console.log('State of wrapped:', this.state); // доступ к state!
    }
  };
}
```

### Что даёт Inheritance Inversion

- Доступ к `this.state` и `this.props` оборачиваемого компонента
- Возможность перехватывать lifecycle-методы
- Возможность управлять `render()` — например, условное отображение, wrapping

```tsx
// Пример: рендер-хайджекинг (перехват рендера)
function withLoadingIndicator<P>(WrappedComponent: React.ComponentClass<P>) {
  return class extends WrappedComponent {
    render() {
      if ((this.props as any).isLoading) {
        return <div className="spinner">Загрузка...</div>;
      }
      return super.render();
    }
  };
}
```

### Практика и применение

В **современном React** этот паттерн практически не применяется:
- Работает **только с классовыми компонентами** (наследование)
- Создаёт **сильную связанность** HOC и WrappedComponent
- Логика переплетается через прототипную цепочку
- Функциональные компоненты + хуки решают те же задачи без наследования

Исторически применялся для:
- **Render hijacking** — условный рендер, обёртка
- **State abstraction** — чтение/изменение state через this.state
- **Мониторинг** — перехват render/lifecycle для профилирования

### Важные нюансы и краеугольные камни

- **Не работает с функциональными компонентами** — нет прототипа для наследования
- **Хрупкость**: если WrappedComponent изменит название метода — HOC сломается
- `super.componentDidMount()` — нужно явно вызывать, иначе оригинальный CDM не выполнится
- Нарушает принцип **единственной ответственности** и **инкапсуляции**

### Примеры

```tsx
// Академический пример для понимания концепции
class UserProfile extends React.Component<{ userId: string }, { user: User | null }> {
  state = { user: null };

  async componentDidMount() {
    const user = await fetchUser(this.props.userId);
    this.setState({ user });
  }

  render() {
    return this.state.user ? <div>{this.state.user.name}</div> : null;
  }
}

// Inheritance Inversion: HOC читает state WrappedComponent
function withUserLogger<P>(Comp: React.ComponentClass<P>) {
  return class extends Comp {
    componentDidUpdate() {
      // Доступ к state WrappedComponent через this.state
      console.log('User state changed:', this.state);
    }
  };
}

const LoggedUserProfile = withUserLogger(UserProfile);
// Теперь при каждом обновлении логируется state UserProfile
```

---

## Сравнение

| Критерий | Props Proxy | Inheritance Inversion |
|----------|-------------|----------------------|
| Механизм | Обёртка, props delegation | Наследование |
| Доступ к state | Нет | Да |
| Работает с FC | Да | Нет |
| Связанность | Слабая | Сильная |
| Применяется | Активно | Редко (legacy) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Inheritance Inversion не рекомендуется?** — сильная связанность, работает только с классами, нет в функциональных компонентах
- **Чем Props Proxy отличается от Inheritance Inversion?** — Props Proxy — обёртка снаружи; II — расширение изнутри через наследование
- **Что заменяет II в функциональном React?** — custom hooks, useImperativeHandle для доступа к «внутренностям»

### Красные флаги (чего не говорить)

- «Inheritance Inversion широко используется» — в современном React это редкий legacy паттерн
- «React продвигает наследование компонентов» — официально Facebook рекомендует композицию над наследованием

### Связанные темы

- `036-chto-takoe-komponent-vysshego-poryadka-higher-order-component-hoc.md`
- `008-raznica-mezhdu-klassovym-i-funkcionalnym-komponentami.md`
