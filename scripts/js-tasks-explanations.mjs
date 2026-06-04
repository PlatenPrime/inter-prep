/**
 * Краткие объяснения решений (RU) для js-tasks, ключ — slug.
 * @type {Record<string, string>}
 */
export const explanations = {
  'is-primitive':
    'Примитив в JS — null, string, number, boolean, bigint, symbol и undefined; объекты и функции не примитивы. null отдельно проверяем, т.к. typeof null === "object". Сложность O(1).',
  'typeof-detailed':
    'Стандартный typeof не различает null и object, не помечает массивы. Проверяем null, Array.isArray и Date, иначе возвращаем typeof. Типичный вопрос на знание особенностей typeof.',
  'is-plain-object':
    'Plain object — объект с прототипом Object.prototype или Object.create(null). Массивы, Date и экземпляры классов отсекаем через прототип. На собеседовании часто уточняют отличие от «любого object».',
  'to-boolean':
    'Используем правила ToBoolean: 0, "", null, undefined, NaN → false, остальное → true. Пустой массив и {} — true. Можно через Boolean(value) или двойное отрицание.',
  'coerce-number':
    'Number() даёт NaN для нечисловых строк; пустая строка и null дают 0. Для практики безопасного API возвращаем null вместо NaN. Учти, что Number(false) === 0.',
  'coerce-string':
    'null и undefined приводим к пустой строке предсказуемо; остальное через String(). Symbol нужно явно обрабатывать, если требуют строгий контракт.',
  'safe-json-parse':
    'Оборачиваем JSON.parse в try/catch и возвращаем fallback при SyntaxError. Не глотайте другие ошибки без необходимости — на интервью упомяните разницу.',
  'shallow-clone':
    'Для массива — spread или slice; для объекта — spread или Object.assign. Вложенные ссылки копируются, не клонируются. Глубокий clone — отдельная задача.',
  'sum-array':
    'Классика reduce((acc, x) => acc + x, 0) или цикл for. Пустой массив даёт 0. Сложность O(n).',
  'reverse-string':
    'Разбиваем на символы ([...str] учитывает суррогаты лучше, чем split("")), reverse, join. Сложность O(n) по длине строки.',
  fizzbuzz:
    'Проверяем кратность 15, затем 3 и 5. Порядок условий важен: сначала FizzBuzz. На собеседовании часто просят без лишних веток или с map.',
  'is-palindrome':
    'Нормализуем: lower case, только буквы/цифры. Сравниваем с reverse или два указателя с концов. Пустая строка — палиндром.',
  'count-words':
    'trim и split по пробелам (/\s+/). Пустая строка после trim → 0 слов. Несколько пробелов не должны давать лишние слова.',
  capitalize:
    'Первый символ toUpperCase + остаток строки без изменений. Пустая строка возвращается как есть.',
  truncate:
    'Если длина ≤ max — исходная строка. Иначе обрезаем с учётом suffix (часто «...»). Не забыть граничный случай max < длины suffix.',
  compact:
    'filter(Boolean) убирает все falsy: 0, "", null, undefined, NaN, false. Если нужно сохранить 0 — другой предикат.',
  uniq:
    'Set сохраняет порядок первого вхождения в современных JS. Альтернатива — filter + indexOf, но медленнее O(n²).',
  range:
    'Цикл for с шагом step: при step > 0 идём до end (не включая), при отрицательном step — вниз. Пустой массив, если границы не позволяют ни одной итерации.',
  'max-min':
    'Math.max/min со spread работает для умеренных массивов; для больших — один проход for. Пустой массив — edge case (±Infinity или ошибка).',
  factorial:
    'Итеративное умножение 2..n; 0! = 1. Рекурсия допустима, но на интервью чаще ждут цикл из-за лимита стека.',
  once:
    'Замыкание: флаг called и кэш результата. Первый вызов выполняет fn, дальше возвращаем сохранённое. Контекст this можно сохранить через apply.',
  memoize:
    'Кэш по ключу JSON.stringify(args) — просто, но ключаются только JSON-serializable аргументы. Map с ключом-строкой достаточно для учебной задачи.',
  'memoize-resolver':
    'Ключ кэша задаёт resolver(...args) — полезно, когда stringify не подходит (объекты, большие структуры). Паттерн как в lodash memoize.',
  curry:
    'Рекурсивно возвращаем функцию, пока args.length < arity; иначе вызываем исходную fn. arity фиксируем явно — отличие от auto-curry.',
  'curry-auto':
    'arity = fn.length; накапливаем аргументы до полного набора. Rest-параметры в исходной fn ломают length — на интервью это стоит упомянуть.',
  compose:
    'reduceRight: последняя функция в списке применяется первой к x. Порядок как в математической композиции f∘g.',
  pipe:
    'reduce слева направо — первая функция получает x первой. Удобнее читать поток данных сверху вниз.',
  'create-counter':
    'Замыкание над value; методы возвращают новое значение. getter value не даёт менять снаружи напрямую.',
  'create-stack':
    'Массив в замыкании: push/pop O(1), peek — последний элемент. Стек не экспонируем наружу.',
  'create-queue':
    'FIFO: enqueue push, dequeue shift (O(n) у массива; для O(1) — кольцевой буфер, но для middle достаточно знать trade-off).',
  partial:
    'Возвращаем (...rest) => fn(...preset, ...rest). Порядок аргументов фиксирован: сначала пресет, потом вызов.',
  negate:
    'Обёртка (...args) => !fn(...args). Сохраняем все аргументы предиката.',
  tap:
    'Вызываем sideEffect(value), возвращаем value — для отладки в цепочках pipe/compose без изменения потока.',
  debounce:
    'clearTimeout + setTimeout на wait: fn вызовется после паузы. Trailing debounce — классика для поиска по вводу.',
  throttle:
    'Ограничиваем частоту: либо сразу при истечении окна, либо отложенный вызов. В задаче — гибрид leading + trailing timeout.',
  'debounce-leading':
    'При leading первый вызов в окне срабатывает сразу, остальные сбрасывают таймер. Флаг «есть активный таймер» отличает первый вызов.',
  'throttle-trailing':
    'В окне wait гарантируем вызов в конце серии событий через отложенный setTimeout. Подходит для scroll/resize handlers.',
  limiter:
    'Счётчик вызовов в замыкании; после max возвращаем undefined или игнорируем. Проще rate limit, чем скользящее окно.',
  lazy:
    'При первом вызове вычисляем factory() и запоминаем; дальше возвращаем кэш. Отличается от once тем, что без аргументов.',
  'retry-sync':
    'Цикл try/catch до times попыток; последнюю ошибку пробрасываем. Для async — отдельная задача retryAsync.',
  'my-call':
    'Временно кладём fn в context как метод и вызываем — this станет context. Symbol/unbound — edge cases для продвинутых.',
  'my-apply':
    'Как call, но аргументы массивом. В современном коде чаще spread: fn.call(ctx, ...args).',
  'my-bind':
    'Partial + фиксированный this через замыкание. newBound должна наследовать prototype, если bind используют с new — усложнение для senior.',
  'instanceof-polyfill':
    'Идём по цепочке __proto__ и сравниваем с Constructor.prototype. Поведение как у instanceof для обычных классов.',
  'object-create':
    'Полифилл Object.create: функция-конструктор с prototype = obj, new + return object. null proto — отдельный ветвь.',
  'has-own':
    'Object.prototype.hasOwnProperty.call(obj, key) — безопасно, если obj может не иметь hasOwnProperty.',
  pick:
    'reduce по keys: копируем только существующие own/enumerable в зависимости от требований. В задаче — ключ in obj.',
  omit:
    'filter entries по Set ключей. Shallow — вложенные объекты остаются теми же ссылками.',
  merge:
    'Object.assign({}, ...objects) — последний wins для коллизий. Shallow merge.',
  'get-path':
    'split(".") и спуск по объекту; при null/undefined на пути — defaultValue. "a.b" vs массив ключей — уточни на интервью.',
  'deep-merge':
    'Рекурсия только для plain nested objects; массивы обычно заменяют целиком. Циклические ссылки в middle редко требуют.',
  'map-polyfill':
    'Новый массив той же длины; callback получает (value, index, array). thisArg через call.',
  'filter-polyfill':
    'Push в результат при truthy pred.call. Не мутируем исходный массив.',
  'reduce-polyfill':
    'Если нет initial — аккумулятор = arr[0], старт с индекса 1. Пустой массив без initial — ошибка, как в нативном reduce.',
  'array-find':
    'Линейный поиск: первый элемент, где pred true. Возвращаем undefined, если не найден.',
  flat:
    'Рекурсия с depth: concat рекурсивно для массивов, иначе элемент. depth 0 — копия без flatten.',
  'group-by':
    'reduce в объект: ключ keyFn(item), значение — массив элементов. Ключи приводятся к string (как в lodash).',
  'count-by':
    'Похоже на groupBy, но считаем количество: acc[key] = (acc[key] || 0) + 1.',
  defaults:
    'Копия obj, для ключей undefined подставляем из defs. Существующие null не перезаписываем.',
  'set-path':
    'Создаём промежуточные объекты по пути, если нет. Мутируем исходный obj или клон — по условию задачи.',
  delay:
    'new Promise(resolve => setTimeout(resolve, ms)). Основа для retry, poll, тестов async.',
  promisify:
    'Обёртка с callback последним аргументом (err, result). err → reject, иначе resolve.',
  'promise-all':
    'Ждём все промисы; один reject ломает всё. Индексы сохраняем через results[i]. Пустой iterable → [].',
  'promise-race':
    'Первый settled (resolve или reject) побеждает. Пустой race в спецификации — вечное ожидание.',
  'promise-any':
    'Первый fulfilled; если все rejected — AggregateError. Полезно для «любой из зеркал ответил».',
  'promise-all-settled':
    'Никогда не reject: массив { status, value|reason }. Удобно для batch без отмены всего.',
  sequence:
    'for...of с await — строго последовательно. Параллель — Promise.all, здесь важен порядок.',
  'map-limit':
    'Пул воркеров limit штук: общий index++, каждый worker крутит while. Контроль конкуренции без лишних промисов.',
  'retry-async':
    'await fn() в цикле, catch — повтор до times. Последняя ошибка наружу.',
  'timeout-promise':
    'Promise.race между исходным и таймером-reject. Очищать таймер при resolve — улучшение для прода.',
  'cancelable-promise':
    'Возвращаем promise + cancel(), reject при отмене. Не отменяет сам async body без AbortSignal — оговорка для интервью.',
  'sleep-scheduler':
    'Очередь задач с задержкой: setTimeout chains или min-heap для многих таймеров. Учебная версия — простая очередь.',
  pool:
    'Ограничение одновременных async задач: семафор + очередь. Как mapLimit, но для произвольных промисов.',
  mutex:
    'Очередь lock: пока locked, ждём; release передаёт следующему. Критично для shared state в async.',
  poll:
    'Периодически вызываем fn, пока pred(result) не true. interval + await delay между попытками.',
  'parallel-map':
    'Все элементы параллельно через Promise.all(map(fn)). Без лимита — риск перегрузки I/O.',
  'async-once':
    'Только один in-flight promise: повторные вызовы ждут тот же promise. Отличается от sync once кэшем результата после resolve.',
  'exponential-backoff':
    'delay * 2**attempt между retry. Потолок maxDelay и jitter — частые дополнения на middle.',
  barrier:
    'N async задач должны завершиться, затем общий callback/Promise.all. Синхронизация «все готовы».',
  'settle-first':
    'Первый fulfilled или rejected — как race, но иногда фильтруют только resolve. Уточни контракт в условии.',
  chunk:
    'slice по окнам size; последний chunk может быть короче. size <= 0 — edge case.',
  'two-sum':
    'Map value→index: для nums[i] ищем target - nums[i]. O(n) время, O(n) память.',
  'valid-parentheses':
    'Стек открывающих; на закрывающую — проверка пары. В конце стек пуст.',
  'merge-sorted':
    'Два указателя i, j; меньший в output. Хвосты дописываем slice. O(n+m).',
  'binary-search':
    'lo, hi, mid; сужаем половину. Условие lo <= hi для поиска в отсортированном массиве.',
  'remove-duplicates-sorted':
    'In-place два указателя (write, read) или новый массив с одним проходом. Sorted — дубликаты рядом.',
  'missing-number':
    'Сумма 0..n = n*(n+1)/2 минус сумма nums. XOR — альтернатива без overflow риска в теории.',
  'climbing-stairs':
    'Fibonacci: ways(n) = ways(n-1) + ways(n-2). DP O(n) время, O(1) память.',
  'lru-cache':
    'Map сохраняет порядок вставки: get/set move to end; при переполнении delete первого ключа. O(1) amortized в современных Map.',
  mitt:
    'Объект type → handlers[]; emit копирует массив handlers, чтобы off во время emit был безопасен.',
  'pub-sub':
    'Классический pub/sub: subscribe возвращает unsubscribe; publish всем подписчикам topic. Отделение издателя от подписчиков.',
  'majority-element':
    'Алгоритм Бойера–Муре: кандидат + счётчик. Для гарантии majority второй проход, в задаче — один проход.',
  'coin-change-min':
    'DP: dp[i] = min монет для суммы i. Инициализация Infinity, dp[0]=0. Недостижимая сумма → -1.',
  'max-subarray':
    'Кадане: maxEndingHere, maxSoFar. O(n), отрицательные числа учтены.',
  'contains-duplicate':
    'Set.size !== nums.length — есть дубликат. Сортировка + соседи — O(n log n) без доп. памяти.',
  strategy:
    'Контекст держит map имя → функция; run(name, args) делегирует. Open/closed: новые стратегии без изменения контекста.',
  adapter:
    'Оборачиваем legacy callback API в Promise/fetchUser. Изолируем некрасивый API от остального кода.',
  'rate-limiter':
    'Скользящее окно или token bucket: не более N вызовов за interval. В учебной задаче — timestamps в очереди.',
  'circuit-breaker':
    'Состояния closed/open/half-open: после порога ошибок блокируем вызовы, потом пробный вызов. Защита от каскадных сбоев.',
  pipeline:
    'Цепочка sync/async функций: output prev → input next. reduce/reduceRight с await для async шагов.',
};

/** @param {string} slug */
export function getExplanation(slug) {
  const text = explanations[slug];
  if (!text) {
    throw new Error(`Missing explanation for slug: ${slug}`);
  }
  return text;
}
