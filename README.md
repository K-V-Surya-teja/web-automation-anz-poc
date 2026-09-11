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

Create a Pipeline job pointing to this repository's `Jenkinsfile`, then click **Build Now**. The pipeline runs only the `@account-number-visibility` scenario and uses Chromium by default. Set `WEB_BASE_URL` in the Jenkins agent environment or provide it through the local `.env` configuration; it is not passed through the Jenkinsfile. To run another feature, change the tag in the `Run Web Tests` stage of the Jenkinsfile and push the change.

The job records JUnit results and archives the Cucumber HTML and Allure result files on every build. The Pipeline, JUnit, HTML Publisher, and Allure Report plugins can be installed to add dedicated report links to the build page. Configure MFA scenarios with `MFA_BASE_URL`, `GITHUB_USER`, `GITHUB_PASS`, and `GITHUB_MFA_SECRET` as Jenkins environment variables or credentials; do not commit them to the repository.
