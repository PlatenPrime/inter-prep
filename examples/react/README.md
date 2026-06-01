# examples/react — каталог 001–100

Обучающие примеры React для собеседований: теория, компонент, Vitest + Testing Library.

## Запуск

```bash
npm run examples:react
npx vitest run examples/react/01-fundamentals/001-hello-props.test.tsx
npm run generate:examples-react
```

## Оглавление

### `01-fundamentals/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 001 | [`001-hello-props`](01-fundamentals/001-hello-props.tsx) | Hello + props | easy |
| 002 | [`002-props-spread`](01-fundamentals/002-props-spread.tsx) | Spread props | easy |
| 003 | [`003-children-composition`](01-fundamentals/003-children-composition.tsx) | Children composition | easy |
| 004 | [`004-conditional-render`](01-fundamentals/004-conditional-render.tsx) | Conditional render | easy |
| 005 | [`005-list-keys`](01-fundamentals/005-list-keys.tsx) | List keys | easy |
| 006 | [`006-fragment`](01-fundamentals/006-fragment.tsx) | Fragment | easy |
| 007 | [`007-event-handler`](01-fundamentals/007-event-handler.tsx) | Event handler | easy |
| 008 | [`008-controlled-input`](01-fundamentals/008-controlled-input.tsx) | Controlled input | easy |
| 009 | [`009-uncontrolled-ref`](01-fundamentals/009-uncontrolled-ref.tsx) | Uncontrolled ref | medium |
| 010 | [`010-strict-mode-dev`](01-fundamentals/010-strict-mode-dev.tsx) | StrictMode in dev | medium |

### `02-rendering/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 011 | [`011-key-reorder`](02-rendering/011-key-reorder.tsx) | Key reorder list | medium |
| 012 | [`012-conditional-mount`](02-rendering/012-conditional-mount.tsx) | Conditional mount | easy |
| 013 | [`013-portal-basic`](02-rendering/013-portal-basic.tsx) | Portal basic | medium |
| 014 | [`014-callback-ref`](02-rendering/014-callback-ref.tsx) | Callback ref | medium |
| 015 | [`015-use-id`](02-rendering/015-use-id.tsx) | useId | easy |
| 016 | [`016-batch-updates`](02-rendering/016-batch-updates.tsx) | Batch updates | medium |
| 017 | [`017-error-fallback-ui`](02-rendering/017-error-fallback-ui.tsx) | Error fallback UI | medium |
| 018 | [`018-suspense-fallback`](02-rendering/018-suspense-fallback.tsx) | Suspense fallback | medium |
| 019 | [`019-lazy-suspense`](02-rendering/019-lazy-suspense.tsx) | lazy + Suspense | medium |
| 020 | [`020-hydration-safe-text`](02-rendering/020-hydration-safe-text.tsx) | Hydration-safe text | medium |

### `03-hooks-core/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 021 | [`021-use-state-counter`](03-hooks-core/021-use-state-counter.tsx) | useState counter | easy |
| 022 | [`022-use-effect-fetch`](03-hooks-core/022-use-effect-fetch.tsx) | useEffect cleanup | medium |
| 023 | [`023-use-ref-dom`](03-hooks-core/023-use-ref-dom.tsx) | useRef DOM | easy |
| 024 | [`024-use-memo-expensive`](03-hooks-core/024-use-memo-expensive.tsx) | useMemo | medium |
| 025 | [`025-use-callback-child`](03-hooks-core/025-use-callback-child.tsx) | useCallback | medium |
| 026 | [`026-use-reducer`](03-hooks-core/026-use-reducer.tsx) | useReducer | medium |
| 027 | [`027-use-context-theme`](03-hooks-core/027-use-context-theme.tsx) | useContext | medium |
| 028 | [`028-custom-hook-toggle`](03-hooks-core/028-custom-hook-toggle.tsx) | Custom hook | easy |
| 029 | [`029-use-layout-effect`](03-hooks-core/029-use-layout-effect.tsx) | useLayoutEffect | hard |
| 030 | [`030-hooks-order-valid`](03-hooks-core/030-hooks-order-valid.tsx) | Valid hooks order | medium |

### `04-state-context/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 031 | [`031-lifting-state`](04-state-context/031-lifting-state.tsx) | Lifting state up | easy |
| 032 | [`032-derived-state`](04-state-context/032-derived-state.tsx) | Derived state | medium |
| 033 | [`033-context-provider`](04-state-context/033-context-provider.tsx) | Context provider | medium |
| 034 | [`034-split-context`](04-state-context/034-split-context.tsx) | Split context | hard |
| 035 | [`035-selector-hook`](04-state-context/035-selector-hook.tsx) | Selector hook | hard |
| 036 | [`036-stale-closure-fix`](04-state-context/036-stale-closure-fix.tsx) | Stale closure fix | medium |
| 037 | [`037-optimistic-toggle`](04-state-context/037-optimistic-toggle.tsx) | Optimistic UI | medium |
| 038 | [`038-controlled-modal`](04-state-context/038-controlled-modal.tsx) | Controlled modal | medium |
| 039 | [`039-form-field-sync`](04-state-context/039-form-field-sync.tsx) | Form field sync | medium |
| 040 | [`040-broadcast-channel-mock`](04-state-context/040-broadcast-channel-mock.tsx) | External store sync | hard |

### `05-performance/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 041 | [`041-react-memo`](05-performance/041-react-memo.tsx) | React.memo | medium |
| 042 | [`042-stable-callback-memo`](05-performance/042-stable-callback-memo.tsx) | Stable callback + memo | medium |
| 043 | [`043-use-memo-calc`](05-performance/043-use-memo-calc.tsx) | useMemo calculation | medium |
| 044 | [`044-use-transition`](05-performance/044-use-transition.tsx) | useTransition | hard |
| 045 | [`045-virtual-slice`](05-performance/045-virtual-slice.tsx) | Virtual list slice | hard |
| 046 | [`046-debounced-search`](05-performance/046-debounced-search.tsx) | Debounced search | medium |
| 047 | [`047-context-value-memo`](05-performance/047-context-value-memo.tsx) | Context value memo | hard |
| 048 | [`048-lazy-route-mock`](05-performance/048-lazy-route-mock.tsx) | Lazy route mock | medium |
| 049 | [`049-start-transition-urgent`](05-performance/049-start-transition-urgent.tsx) | Urgent vs transition | hard |
| 050 | [`050-avoid-inline-props`](05-performance/050-avoid-inline-props.tsx) | Avoid inline object props | medium |

### `06-forms/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 051 | [`051-controlled-text`](06-forms/051-controlled-text.tsx) | Controlled text | easy |
| 052 | [`052-checkbox-group`](06-forms/052-checkbox-group.tsx) | Checkbox group | medium |
| 053 | [`053-select-controlled`](06-forms/053-select-controlled.tsx) | Select controlled | easy |
| 054 | [`054-validation-message`](06-forms/054-validation-message.tsx) | Validation message | medium |
| 055 | [`055-use-action-state`](06-forms/055-use-action-state.tsx) | useActionState | hard |
| 056 | [`056-form-reducer`](06-forms/056-form-reducer.tsx) | Form reducer | medium |
| 057 | [`057-reset-form`](06-forms/057-reset-form.tsx) | Reset form | easy |
| 058 | [`058-file-input`](06-forms/058-file-input.tsx) | File input | medium |
| 059 | [`059-default-value`](06-forms/059-default-value.tsx) | defaultValue uncontrolled | easy |
| 060 | [`060-submit-prevent`](06-forms/060-submit-prevent.tsx) | Submit preventDefault | easy |

### `07-composition/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 061 | [`061-compound-tabs`](07-composition/061-compound-tabs.tsx) | Compound tabs | medium |
| 062 | [`062-render-prop`](07-composition/062-render-prop.tsx) | Render prop | medium |
| 063 | [`063-hoc-wrapper`](07-composition/063-hoc-wrapper.tsx) | HOC wrapper | medium |
| 064 | [`064-forward-ref-input`](07-composition/064-forward-ref-input.tsx) | forwardRef input | medium |
| 065 | [`065-merge-refs`](07-composition/065-merge-refs.tsx) | Merge refs | hard |
| 066 | [`066-slot-pattern`](07-composition/066-slot-pattern.tsx) | Slot pattern | medium |
| 067 | [`067-polymorphic-button`](07-composition/067-polymorphic-button.tsx) | Polymorphic button | hard |
| 068 | [`068-error-boundary`](07-composition/068-error-boundary.tsx) | Error boundary | hard |
| 069 | [`069-provider-stack`](07-composition/069-provider-stack.tsx) | Provider stack | medium |
| 070 | [`070-dialog-focus`](07-composition/070-dialog-focus.tsx) | Dialog focus | hard |

### `08-data-fetching/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 071 | [`071-use-query-success`](08-data-fetching/071-use-query-success.tsx) | useQuery success | medium |
| 072 | [`072-use-query-error`](08-data-fetching/072-use-query-error.tsx) | useQuery error | medium |
| 073 | [`073-use-mutation`](08-data-fetching/073-use-mutation.tsx) | useMutation | medium |
| 074 | [`074-query-invalidate`](08-data-fetching/074-query-invalidate.tsx) | Invalidate queries | hard |
| 075 | [`075-suspense-query`](08-data-fetching/075-suspense-query.tsx) | Suspense query | hard |
| 076 | [`076-retry-query`](08-data-fetching/076-retry-query.tsx) | Retry query | medium |
| 077 | [`077-optimistic-mutation`](08-data-fetching/077-optimistic-mutation.tsx) | Optimistic mutation | hard |
| 078 | [`078-prefetch-hover`](08-data-fetching/078-prefetch-hover.tsx) | Prefetch on hover | medium |
| 079 | [`079-pagination-query`](08-data-fetching/079-pagination-query.tsx) | Pagination query | hard |
| 080 | [`080-dependent-queries`](08-data-fetching/080-dependent-queries.tsx) | Dependent queries | hard |

### `09-routing/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 081 | [`081-memory-router`](09-routing/081-memory-router.tsx) | MemoryRouter | easy |
| 082 | [`082-link-navigation`](09-routing/082-link-navigation.tsx) | Link navigation | easy |
| 083 | [`083-url-params`](09-routing/083-url-params.tsx) | URL params | medium |
| 084 | [`084-search-params`](09-routing/084-search-params.tsx) | Search params | medium |
| 085 | [`085-nested-routes`](09-routing/085-nested-routes.tsx) | Nested routes | medium |
| 086 | [`086-index-route`](09-routing/086-index-route.tsx) | Index route | medium |
| 087 | [`087-protected-route`](09-routing/087-protected-route.tsx) | Protected route | hard |
| 088 | [`088-loader-wrapper`](09-routing/088-loader-wrapper.tsx) | Loader wrapper | hard |
| 089 | [`089-navigate-programmatic`](09-routing/089-navigate-programmatic.tsx) | useNavigate | medium |
| 090 | [`090-not-found`](09-routing/090-not-found.tsx) | 404 fallback | easy |

### `10-patterns-testing/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 091 | [`091-rtl-query-priority`](10-patterns-testing/091-rtl-query-priority.tsx) | RTL query priority | easy |
| 092 | [`092-user-event-sequence`](10-patterns-testing/092-user-event-sequence.tsx) | userEvent sequence | medium |
| 093 | [`093-find-by-async`](10-patterns-testing/093-find-by-async.tsx) | findBy async | medium |
| 094 | [`094-mock-fetch`](10-patterns-testing/094-mock-fetch.tsx) | Mock fetch | medium |
| 095 | [`095-custom-render`](10-patterns-testing/095-custom-render.tsx) | Custom render | medium |
| 096 | [`096-within-scoped`](10-patterns-testing/096-within-scoped.tsx) | within scoped queries | easy |
| 097 | [`097-accessible-name`](10-patterns-testing/097-accessible-name.tsx) | Accessible name | medium |
| 098 | [`098-test-id-last-resort`](10-patterns-testing/098-test-id-last-resort.tsx) | data-testid last resort | easy |
| 099 | [`099-mock-module`](10-patterns-testing/099-mock-module.tsx) | vi.mock module | hard |
| 100 | [`100-interview-recap`](10-patterns-testing/100-interview-recap.tsx) | Interview recap app | medium |

