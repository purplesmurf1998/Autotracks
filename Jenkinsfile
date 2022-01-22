pipeline {
  agent {
    docker {
      image 'node:16.13.1-alpine'
      args '''-p 5000 
-u root'''
    }

  }
  stages {
    stage('Build ') {
      parallel {
        stage('Build Backend') {
          agent {
            docker {
              image 'node:16.13.1-alpine'
              args '''-u root 
-p 5000'''
            }

          }
          steps {
            echo 'Building Backend...'
            dir(path: 'Autotracks/backend') {
              sh 'npm install --force'
            }

          }
        }

        stage('Build Frontend') {
          agent any
          steps {
            echo 'Building Frontend...'
            dir(path: '../frontend') {
              sh 'npm install --force'
            }

          }
        }

      }
    }

    stage('Test') {
      agent any
      steps {
        echo 'Testing'
        dir(path: '../')
        dir(path: frontend) {
          sh 'npm test'
        }

      }
    }

    stage('Deliver') {
      agent any
      steps {
        echo 'Deploying Server'
        sh 'npm run serve'
      }
    }

  }
}