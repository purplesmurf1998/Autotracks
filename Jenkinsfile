pipeline {
  agent {
    node {
      label 'autotracks-jenkins'
    }

  }
  stages {
    stage('Build') {
      agent any
      steps {
        echo 'Cloning Branch'
        pwd()
        echo 'Building Backend...'
        dir(path: 'Autotracks/backend') {
          sh 'npm install'
        }

        echo 'Building Front End'
        dir(path: '../frontend') {
          sh 'npm install'
        }

        dir(path: '../')
      }
    }

    stage('Test') {
      steps {
        echo 'Testing'
        dir(path: backend) {
          sh 'npm test'
        }

        dir(path: '../')
        dir(path: frontend) {
          sh 'npm test'
        }

      }
    }

    stage('Deliver') {
      steps {
        echo 'Deploying Server'
        sh 'npm run serve'
      }
    }

  }
}