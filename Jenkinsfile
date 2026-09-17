pipeline {
    agent any

    // Scheduled trigger is currently disabled.
    // Uncomment this block to run once daily at approximately 2:00 AM.
    // Jenkins uses the controller/agent timezone for this schedule.
    // triggers {
    //     cron('H 2 * * *')
    // }

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
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Web Tests') {
            steps {
                bat 'npm run test:web -- --tags "@account-number-visibility"'
            }
        }
    }

    post {
        always {
            junit testResults: 'reports/cucumber-results.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'reports/**/*,allure-results/**/*', allowEmptyArchive: true
//             emailext(
//                 to: 'vivek123shegal@gmail.com',
//                 subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
//                 body: """<p>Jenkins build <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> finished with status: <b>${currentBuild.currentResult}</b>.</p>
// <p>Build URL: <a href=\"${env.BUILD_URL}\">${env.BUILD_URL}</a></p>
// <p>The Cucumber HTML report and JUnit results are attached.</p>""",
//                 mimeType: 'text/html',
//                 attachmentsPattern: 'reports/web-cucumber-report.html,reports/cucumber-results.xml',
//                 attachLog: true
//             )
        }
    }
}