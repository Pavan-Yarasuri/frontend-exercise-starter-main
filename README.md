## About this implementation

This fork contains a completed implementation of the Listings Manager exercise with a focus on:

- A paginated product list with sortable columns and accessible table markup.
- Product details view on a separate route with loading and error handling.
- A toolbar with search, category filter, sort, and a Clear Filters control.
- Accessibility improvements: roles, labels, aria-controls, aria-live regions and keyboard-focusable pagination controls.
- Deterministic end-to-end tests using Cypress that assert both UI behavior and outgoing network requests.

The intent of the implementation is to be small, well-structured, and easy to explain.

Implemented features (summary)

- Product List: paginated, shows name, price, category and stock status.
- Product Details: fetches /products/:id and shows price/category/stock with loading/error states.
- Search & Filter: search by name, filter by category, sort by several options.
- Pagination: page navigation and page-size selector
- Accessibility: aria attributes on toolbar, table, pagination and live regions for status/messages.
- Tests: Cypress E2E specs that mock network responses via cy.intercept for deterministic behavior.

Small notes on design decisions & trade-offs

- The app uses a small React context (`ProductListContext`) to manage toolbar and pagination state. This keeps the list and toolbar loosely coupled.
- Network requests are handled by a simple `useFetchData` hook which maps context state to query params.
- Accessibility changes are conservative and incremental (labels, role attributes, aria-live).

Where to look in the repo

- Toolbar: `src/components/Toolbar/Toolbar.tsx` (search, filter, sort and clear)
- Table and Pagination: `src/components/TableSection/*` (table, pagination UI)
- Context: `src/context/context.tsx` (state & reset)
- Fetch hook: `src/components/hooks/useFetchData.tsx`
- Cypress tests: `cypress/e2e/*` (product list/details and toolbar-pagination integration)

How to run locally

1. Install dependencies and initialize MSW (one-time):

```powershell/terminal/cmd
npm install
```

2. Start the dev server:

```powershell/terminal/cmd
npm run dev
```

3. Open the app at http://localhost:5173

Running tests

- Open Cypress UI (interactive):

```powershell/terminal/cmd
npx cypress open
```

What I'd do with more time

- Improve visual styling and add more edge-case tests (very large data sets).

- Add more test cases and improve the overall testing of the project.

- Test the scalability of the application when handling large datasets.

- Handle more edge case scenarios like adding tooltip for very large product names.

- Add an option to provide custom offset instead of predefined ones.

- Automate 'Category' filter dropdown items by computing from the API directly.

- Implement virtualization for tables to improve performance with very large datasets.

- Add error boundaries and graceful fallback UI for unexpected failures.

- Add husky pre-commit functionality

---
