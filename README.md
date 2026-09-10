# ANZ Web Automation POC

TypeScript and Cucumber web automation for the ParaBank application using Playwright.

## Setup

```powershell
npm install
npx playwright install
```

Create a `.env` file in the repository root with the values required by the web scenarios:

```dotenv
WEB_BASE_URL=https://parabank.parasoft.com/parabank/index.htm
MFA_BASE_URL=https://github.com/login
GITHUB_USER=<user>
GITHUB_PASS=<password>
GITHUB_MFA_SECRET=<secret>
BROWSER=chromium
WEB_PARALLEL_WORKERS=1
```

Do not commit real credentials or secrets.

## Run

```powershell
npm run test:web
npm run test:web -- --tags @smoke
```

HTML and Allure results are written to `reports/` and `allure-results/`.
