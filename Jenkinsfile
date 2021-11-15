pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building Backend...'
        dir(path: Autotracks/backend) {
          sh 'npm install'
        }

        echo 'Building Frontend...'
        dir(path: frontend) {
          sh 'npm install'
        }

      }
    }

    stage('Test') {
      steps {
        echo 'Testing Backend...'
        dir(path: backend) {
          sh 'npm test'
        }

        echo 'Testing Backend...'
        dir(path: frontend) {
          sh 'npm test'
        }

      }
    }

    stage('Deliver') {
      steps {
        echo 'Deploying....'
      }
    }

  }
  environment {
    CI = 'true'
  }
}