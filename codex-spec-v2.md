# 🧭 Codex Specification v2 — Frontend (React + TypeScript)

**Version:** 2.0
**Author:** Yan Qiang
**Target:** Modern React + TypeScript + Vite (or Next.js) frontend
**Goal:** Define a lightweight, scalable, and testable frontend architecture using common modern practices.

---

## 1. Philosophy

> Keep the frontend **simple, modular, and maintainable**. Every component should be small, typed, and easy to extend.

### Core Values

1. Clear separation between **UI, state, and logic**.
2. **Type-safe** with strict TypeScript.
3. **Minimal dependencies** — prefer native React hooks and utilities.
4. **Predictable state management**.
5. **Readable and consistent code style**.

---

## 2. Project Layout

```
frontend-app/
├── src/
│   ├── components/
│   │   ├── common/          # Shared reusable UI (Button, Input)
│   │   └── layout/          # Layout components (Header, Footer)
│   ├── features/
│   │   ├── user/            # Domain-specific features
│   │   │   ├── api.ts
│   │   │   ├── UserList.tsx
│   │   │   └── UserDetail.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── authSlice.ts
│   ├── hooks/               # Custom reusable hooks
│   ├── store/               # Global state (Zustand / Redux Toolkit)
│   ├── utils/               # Helpers (date, validation, etc.)
│   ├── styles/              # Tailwind / CSS Modules / global styles
│   ├── types/               # TypeScript definitions
│   └── main.tsx             # App entry point
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. Technology Stack

| Layer      | Recommended Tool             |
| ---------- | ---------------------------- |
| Framework  | React 18+                    |
| Language   | TypeScript (strict mode)     |
| Build Tool | Vite                         |
| Styling    | Tailwind CSS                 |
| State      | Zustand or Redux Toolkit     |
| API Calls  | Fetch API or Axios           |
| Routing    | React Router v6              |
| Testing    | Jest + React Testing Library |
| Linting    | ESLint + Prettier            |

---

## 4. Coding Standards

### TypeScript

* Enable `strict` mode.
* No implicit `any`.
* Define explicit interfaces for props and API data.

### React Components

* Use **functional components** with hooks.
* Each component should be **<150 lines**.
* Props must be typed.
* Avoid side effects in rendering.

```tsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    onClick={onClick}
  >
    {label}
  </button>
);
```

---

## 5. State Management

| Rule         | Description                      |
| ------------ | -------------------------------- |
| Local State  | `useState`, `useReducer`         |
| Global State | Zustand or Redux Toolkit         |
| Derived Data | Don’t duplicate state, derive it |
| Async Data   | React Query or custom hooks      |

Example (Zustand):

```ts
import { create } from 'zustand';

type UserState = {
  name: string;
  setName: (name: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}));
```

---

## 6. API Layer

Centralize all API calls. Wrap `fetch` for consistency.

```ts
export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```

Use React Query or custom hooks for async data.

---

## 7. Styling

* Use Tailwind CSS with utility-first approach.
* Avoid inline styles.
* Maintain a `theme.ts` file for shared colors and spacing.

```ts
export const theme = {
  colors: {
    primary: '#2563eb',
    text: '#1e293b',
  },
};
```

---

## 8. Testing

| Type      | Tool                  | Location              |
| --------- | --------------------- | --------------------- |
| Unit      | Jest                  | `/tests`              |
| Component | React Testing Library | `/src/components/...` |
| E2E       | Playwright or Cypress | `/e2e`                |

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button label', () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

---

## 9. Linting & Formatting

### ESLint

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ]
}
```

### Prettier

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

---

## 10. CI/CD Example

`.github/workflows/ci.yaml`

```yaml
name: Frontend CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build
```

---

## 11. Developer Workflow

| Step       | Command          | Description          |
| ---------- | ---------------- | -------------------- |
| 🧩 Install | `npm ci`         | Install dependencies |
| 🚀 Run     | `npm run dev`    | Start dev server     |
| 🧪 Test    | `npm test`       | Run unit tests       |
| 🧹 Lint    | `npm run lint`   | Check code quality   |
| 🧱 Build   | `npm run build`  | Production build     |
| ✨ Format   | `npm run format` | Auto format code     |

---

## 12. Production Checklist

* [ ] TypeScript strict mode enabled
* [ ] Lighthouse score >90
* [ ] No console warnings
* [ ] Components under 150 lines
* [ ] Responsive layout (mobile-first)
* [ ] Error boundaries in root
* [ ] Lazy loading for heavy pages

---

## 13. Final Note

> A great frontend is one that’s easy to **read, extend, and debug**.
> Simplicity is power — fewer abstractions, clearer intent, and consistent structure make scaling effortless.

---
