# Election Management System — Frontend Assessment

This project is the UI starter for a frontend/backend integration assessment. The existing screens, components, routes, and `useState` interactions are provided. Backend integration is intentionally left for the student.

## Run the UI

```bash
npm install
npm run dev
```

The application starts without a backend and without seeded sample records. Add records through the UI while exploring it; the current shared state is in memory and resets when the page is refreshed.

## Assessment task

Connect the UI to the election management backend. Implement the API client and endpoint configuration, load server data into the shared state, and replace the temporary local create, edit, delete, status, and save handlers with API calls. Keep the existing UI and form state.

Handle loading, empty, and error states; validate responses and inputs; show useful feedback when requests fail; and update the interface from successful API responses. Election calculation and result history must use the backend response. Do not add hard-coded mock records to stand in for API data.

## Suggested implementation areas

- `src/context/AppContext.tsx` — shared application state and initial data loading.
- `src/api/management/` — add service modules grouped by domain.
- `src/lib/api.ts` — add a shared HTTP client.
- `src/utils/apiEndpoint.ts` — add the base URL and endpoint paths.
- `src/pages/` — connect existing forms and actions to the services while preserving the current UI and `useState` form state.

## API contract

Configure the backend base URL to match your local server. Endpoint paths below are examples; confirm the exact contract with the backend implementation.

| Method | Example endpoint | Expected data |
| --- | --- | --- |
| GET, POST | `/api/provinces` | Province collection / created province |
| PUT, PATCH, DELETE | `/api/provinces/{id}` | Updated province / delete result |
| GET, POST | `/api/districts` | District collection / created district |
| PUT, PATCH, DELETE | `/api/districts/{id}` | Updated district / delete result |
| PUT | `/api/districts/{id}/seats` | Updated district |
| GET, POST | `/api/districts/{districtId}/parties` | Party collection / created party |
| PATCH, DELETE | `/api/districts/{districtId}/parties/{partyId}` | Updated party / delete result |
| GET, PUT | `/api/districts/{districtId}/votes` | Vote entries for a district |
| GET, PUT | `/api/settings/election` | Election settings |
| GET | `/api/elections/results` | Result history, newest first |
| POST | `/api/elections/calculate` | Calculated election result |

## Completion criteria

- The app loads and displays backend data without adding fixture records.
- Create, update, delete, status changes, settings, seat allocation, and election calculation persist through the API.
- Results and reports reflect backend responses.
- Loading, empty, validation, and request failure states are clear to the user.
- Existing visual layout and client-side form interactions remain intact.
