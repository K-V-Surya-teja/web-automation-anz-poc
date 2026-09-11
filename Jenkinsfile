pipeline {
    agent any

    parameters {
        string(name: 'TEST_TAGS', defaultValue: '@smoke', description: 'Cucumber tag expression, for example @smoke or not @wip')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Playwright browser')
        string(name: 'WEB_BASE_URL', defaultValue: 'https://parabank.parasoft.com/parabank/index.htm', description: 'ParaBank URL')
    }

    environment {
        HEADLESS = 'true'
        WEB_PARALLEL_WORKERS = '1'
        BROWSER = "${params.BROWSER}"
        WEB_BASE_URL = "${params.WEB_BASE_URL}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install %BROWSER%'
            }
        }

        stage('Run Web Tests') {
            steps {
                bat 'npm run test:web -- --tags "%TEST_TAGS%"'
            }
        }
    }

    post {
        always {
            junit testResults: 'reports/cucumber-results.xml', allowEmptyResults: true
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'web-cucumber-report.html',
                reportName: 'Cucumber HTML Report'
            ])
            allure includeProperties: false, results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'reports/**/*,allure-results/**/*', allowEmptyArchive: true
        }
    }
}