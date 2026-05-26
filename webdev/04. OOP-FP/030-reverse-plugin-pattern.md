# Q030. Что такое паттерн "обратный плагин" (Reverse-Plugin Pattern)? Когда его стоит использовать?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Reverse Plugin Pattern** — архитектурный паттерн, в котором **низкоуровневые модули (плагины) регистрируются в высокоуровневом ядре**, а не ядро знает о плагинах. Ядро определяет интерфейс, плагины сами «встраиваются» в него. Инвертирует обычное направление зависимости: плагин зависит от ядра, не ядро от плагинов. Применяется для **расширяемых систем** — CMS, IDE (VS Code extensions), webpack-плагины, Angular Modules.

---

## Развёрнутый ответ

### Суть и определение

Обычный плагин-паттерн:
```
Core → знает о → Plugin1, Plugin2, Plugin3
```

**Reverse Plugin Pattern:**
```
Plugin1 → регистрируется в → Core (через интерфейс)
Plugin2 → регистрируется в → Core
Plugin3 → регистрируется в → Core
Core   → не знает о конкретных плагинах
```

Ядро предоставляет **интерфейс регистрации**, а плагины сами инициируют связь.

---

### Реализация

```typescript
// Ядро: определяет контракт, не знает о плагинах
interface Plugin {
  name: string;
  version: string;
  initialize(context: AppContext): void;
  destroy?(): void;
}

interface AppContext {
  registerRoute(path: string, handler: RequestHandler): void;
  registerMiddleware(middleware: Middleware): void;
  emit(event: string, data?: unknown): void;
  on(event: string, handler: (data: unknown) => void): void;
}

class PluginRegistry {
  private plugins = new Map<string, Plugin>();

  // Плагин вызывает этот метод — самостоятельно регистрируется
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  initialize(context: AppContext): void {
    for (const plugin of this.plugins.values()) {
      plugin.initialize(context);
    }
  }

  destroy(): void {
    for (const plugin of this.plugins.values()) {
      plugin.destroy?.();
    }
  }
}

class App {
  private registry = new PluginRegistry();
  private context: AppContext = this.createContext();

  private createContext(): AppContext {
    return {
      registerRoute: (path, handler) => this.router.add(path, handler),
      registerMiddleware: (mw) => this.middlewares.push(mw),
      emit: (event, data) => this.eventBus.emit(event, data),
      on: (event, handler) => this.eventBus.on(event, handler)
    };
  }

  use(plugin: Plugin): this {
    this.registry.register(plugin);
    return this; // fluent API
  }

  start(): void {
    this.registry.initialize(this.context);
  }
}
```

---

### Плагины — знают о ядре через интерфейс, ядро — нет о них

```typescript
// Плагин аутентификации
class AuthPlugin implements Plugin {
  name = 'auth';
  version = '1.0.0';

  initialize(ctx: AppContext): void {
    // Плагин сам регистрирует свои маршруты и middleware
    ctx.registerMiddleware(this.authMiddleware);
    ctx.registerRoute('/login', this.handleLogin.bind(this));
    ctx.registerRoute('/logout', this.handleLogout.bind(this));
    ctx.on('user:created', this.onUserCreated.bind(this));
  }

  private authMiddleware(req: Request, res: Response, next: NextFn): void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
    req.user = verifyToken(token);
    next();
  }

  private handleLogin(req: Request, res: Response): void { /* ... */ }
  private handleLogout(req: Request, res: Response): void { /* ... */ }
  private onUserCreated(user: unknown): void { /* отправить welcome email */ }
}

// Плагин метрик
class MetricsPlugin implements Plugin {
  name = 'metrics';
  version = '1.0.0';

  initialize(ctx: AppContext): void {
    ctx.registerMiddleware(this.trackRequest.bind(this));
    ctx.registerRoute('/metrics', this.exposeMetrics.bind(this));
  }

  private trackRequest(req: Request, res: Response, next: NextFn): void {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.record(req.method, req.path, res.statusCode, duration);
    });
    next();
  }

  private exposeMetrics(req: Request, res: Response): void { /* ... */ }
  private record(...args: unknown[]): void { /* ... */ }
}

// Сборка приложения: ядро не знает о конкретных плагинах
const app = new App()
  .use(new AuthPlugin())
  .use(new MetricsPlugin())
  .use(new LoggingPlugin())
  .use(new CachePlugin());

app.start();
```

---

### Паттерн в реальных фреймворках

```typescript
// VS Code Extension API — классический Reverse Plugin
// Расширение само регистрирует команды в ядре VS Code
export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('myExt.doSomething', () => {
    vscode.window.showInformationMessage('Done!');
  });
  context.subscriptions.push(command);
  // VS Code не знает заранее о расширении — оно само встраивается
}

// Webpack Plugin
class MyWebpackPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // Плагин сам подписывается на хуки компилятора
    });
  }
}

// Angular Module — модуль регистрирует свои провайдеры в инжекторе
@NgModule({
  providers: [UserService, AuthGuard],
  imports: [CommonModule],
})
export class UserModule {}
// Angular-корень не знает о UserModule напрямую до момента его импорта
```

---

### Когда применять

```
✅ Применять:
- Расширяемые платформы (IDE, CMS, bundlers)
- Система с заранее неизвестным количеством расширений
- Нужна изоляция: плагины не должны знать друг о друге
- Динамическая загрузка модулей (lazy loading)
- Команда разрабатывает ядро и плагины независимо

❌ Не применять:
- Небольшое приложение с фиксированным числом модулей
- Когда overhead абстракции не оправдан
- Если плагины всегда нужны все (нет смысла в опциональности)
```

### Практика и применение

- **Express/Koa**: `app.use(middleware)` — форма reverse plugin
- **Webpack/Rollup/Vite**: объект плагина с методами `apply`/`buildStart`
- **NestJS Modules**: динамические модули — Reverse Plugin внутри фреймворка
- **Стратегия feature flags**: каждая фича — плагин, включается конфигом

### Важные нюансы и краеугольные камни

- **Порядок регистрации важен**: плагины выполняются в порядке добавления; middleware-цепочка зависит от порядка
- **Версионирование контракта**: изменение интерфейса `AppContext` ломает все плагины — нужна обратная совместимость
- **Изоляция плагинов**: если плагины могут взаимодействовать — вводи Event Bus, не прямые ссылки

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Reverse Plugin отличается от обычного Plugin?** — В обычном ядро знает о плагинах и вызывает их. В Reverse — плагин инициирует подключение, ядро предоставляет только интерфейс.
- **Как это связано с DIP?** — Reverse Plugin — практическое применение DIP: и ядро, и плагины зависят от абстракции (интерфейса), не друг от друга.
- **Как тестировать ядро с плагинами?** — Ядро тестируется отдельно с mock-плагином; каждый плагин — с mock AppContext.

### Красные флаги (чего не говорить)

- «Не слышал о таком паттерне» — но знаю VS Code Extensions / Webpack plugins — это он и есть.
- Путать с Decorator-паттерном — Decorator добавляет поведение к объекту; Reverse Plugin — архитектурный паттерн расширяемости системы.

### Связанные темы

- `027-tipy-patternov.md`
- `028-chto-takoe-gof-patterny.md`
- `002-chto-takoe-solid.md`
- `004-printsipy-krome-solid.md`
