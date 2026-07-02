# Dynamic Filter System

A **reusable, type-safe dynamic filter component system** built with React 18 + TypeScript that can be integrated with any data table. The system is configuration-driven — pass a `FilterFieldDefinition[]` array and the entire filter UI adapts automatically.

---

## 🚀 Live Demo

> _Deployed on Vercel — link will appear after `vercel --prod`_

---

## 🛠️ Tech Stack

| Concern | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI | Material UI v6 |
| Icons | Lucide React |
| Date handling | dayjs + @mui/x-date-pickers |
| State | `useReducer` (local, no Redux needed) |

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🧩 Component Architecture

```
src/
├── types/
│   ├── filter.types.ts        # All TypeScript contracts
│   └── employee.types.ts      # Employee data model
├── data/
│   └── employees.json         # 55 sample records
├── config/
│   └── employeeFilterConfig.ts # Config for the employee table
├── hooks/
│   ├── useFilterState.ts      # useReducer for filter conditions
│   ├── useFilteredData.ts     # Memoized filtering hook
│   └── useDebounce.ts         # Generic debounce hook
├── utils/
│   ├── filterEngine.ts        # Core filtering algorithms
│   └── operators.ts           # FieldType → Operator mapping
├── components/
│   ├── FilterSystem/
│   │   ├── FilterBuilder.tsx         # Root filter panel
│   │   ├── FilterConditionRow.tsx    # Single filter row
│   │   ├── ActiveFilterChips.tsx     # Applied filter chips
│   │   └── inputs/
│   │       ├── TextFilterInput.tsx
│   │       ├── NumberFilterInput.tsx
│   │       ├── DateRangeInput.tsx
│   │       ├── AmountRangeInput.tsx
│   │       ├── SelectFilterInput.tsx
│   │       ├── MultiSelectFilterInput.tsx
│   │       └── BooleanFilterInput.tsx
│   └── DataTable/
│       ├── DataTable.tsx
│       ├── NoResultsPlaceholder.tsx
│       └── ExportButtons.tsx
└── pages/
    └── EmployeePage.tsx        # Wires everything together
```

---

## ⚙️ Using the Filter System with a Different Table

1. Define your data model in `types/`
2. Create a config file, e.g. `config/transactionFilterConfig.ts`:

```ts
const TRANSACTION_FILTER_CONFIG: FilterFieldDefinition[] = [
  { key: 'amount',        label: 'Amount',         type: 'amount' },
  { key: 'paymentMethod', label: 'Payment Method', type: 'select',
    options: [
      { value: 'Card', label: 'Card' },
      { value: 'Bank', label: 'Bank' },
      { value: 'UPI',  label: 'UPI' },
    ]
  },
  { key: 'isRefunded',   label: 'Refunded',        type: 'boolean' },
];
```

3. Pass the config to `FilterBuilder`:

```tsx
<FilterBuilder
  fieldDefinitions={TRANSACTION_FILTER_CONFIG}
  onApply={handleApply}
  appliedCount={appliedConditions.length}
  isOpen={isOpen}
  onToggle={() => setIsOpen(v => !v)}
/>
```

**Zero internal changes needed.**

---

## 🔍 Supported Filter Types

| FieldType | Operators | Input |
|---|---|---|
| `text` | Contains, Equals, Does Not Contain, Starts With, Ends With | Debounced text field |
| `number` | Equals, >, <, >=, <= | Number field |
| `date` | Between (date range) | Dual date pickers |
| `amount` | Between (range) | Min/Max with $ prefix |
| `select` | Is, Is Not | Single select dropdown |
| `multiselect` | In, Not In | Multi-select with checkboxes |
| `boolean` | Is | Toggle (Active / Inactive) |

---

## 🧠 Filtering Logic

- **AND** between different fields
- **OR** within the same field (multiple conditions on same key)
- **Dot-notation** for nested fields: `address.city`
- **Case-insensitive** text matching
- **Memoized** with `useMemo` — only re-runs when conditions or data change
- **Null-safe** guards at every step

---

## 🌟 Bonus Features

- 💾 **Filter persistence** — conditions saved to `localStorage` automatically
- 📥 **Export CSV / JSON** — client-side Blob download of filtered data
- ⏱️ **Debounced text inputs** — 300ms delay to reduce unnecessary re-renders
- 🏷️ **Active filter chips** — dismissible summary of applied filters
- ↕️ **Sortable columns** — click any column header to sort asc/desc
