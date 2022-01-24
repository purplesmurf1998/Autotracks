pipeline {
  agent none
  stages {
    stage('Build') {
      parallel {
        stage('Frontend') {
          agent {
            docker {
              args '''-u root 
-p 5000'''
              image 'node:14.18.3-alpine'
            }

          }
          steps {
            echo 'Building Backend...'
            dir(path: 'Autotracks/backend') {
              sh 'npm install --force'
            }

            echo 'Building Frontend...'
            dir(path: 'Autotracks/backend') {
              sh 'npm test'
            }

            echo 'Testing Backend'
            dir(path: 'Autotracks/frontend') {
              sh 'npm test'
            }

            echo 'Deploying Server'
            echo 'Deploying Backend'
            dir(path: 'Autotracks/backend') {
              sh 'npm build'
              sh 'node server.js'
            }

          }
        }

        stage('Backend') {
          agent {
            docker {
              image 'node:14.18.3-alpine'
              args '-u root'
            }

          }
          steps {
            dir(path: 'Autotracks/frontend') {
              sh 'npm install --force'
              sh 'npm test'
              sh 'npm run serve'
            }

          }
        }

      }
    }

  }
}