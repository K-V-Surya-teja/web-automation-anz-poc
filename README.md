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

## Jenkins

Create a Pipeline job pointing to this repository's `Jenkinsfile`. The pipeline parameters are:

- `TEST_TAGS`: Cucumber tag expression, defaulting to `@smoke`.
- `BROWSER`: `chromium`, `firefox`, or `webkit`.
- `WEB_BASE_URL`: the ParaBank environment URL.

The Jenkins controller or agent must have the Pipeline, JUnit, HTML Publisher, and Allure Report plugins installed. The job publishes the JUnit results, a link to the Cucumber HTML report, and an Allure report on every build. Configure MFA scenarios with `MFA_BASE_URL`, `GITHUB_USER`, `GITHUB_PASS`, and `GITHUB_MFA_SECRET` as Jenkins environment variables or credentials; do not commit them to the repository.
