# Running instructions

Requires node v22.17.0 or higher

Frontend will work with just the following:
```
npm install
npm run dev
```

Api needs an additional step for the database:

```
npm install
npx drizzle-kit migrate
npm run dev
```


# Tech used

Frontend is React with the following libraries:
- react-query - handling server requests
- shadcn/ui - ui components
- tailwind - styling
- react-hook-form - forms
- zod - validation

API
- express
- drizzle - ORM for easier database management while having an sql-like api
- zod - validation


# Todo

If I had more time these are the things I'd do
- Mobile responsiveness. The biggest thing missing and the first thing I'd fix if I had more time.
- Testing. E2E tests with puppeteer or something similar would be good for this app. Unit testing would be good if heavier logic was introduced but it usefulness would be less at the moment as the app is simple.
- Better table. A data grid with pagination and sorting would have been nice.
- Users. There is no auth and everything is created in one list. Having a login and having different users would be simple enough to add but time consuming.
