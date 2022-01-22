pipeline {
  agent none
  stages {
    stage('Build ') {
      parallel {
        stage('Build Backend') {
          agent {
            docker {
              image 'node:14.16.1-alpine'
              args '''-u root
-p 5000'''
            }

          }
          steps {
            echo 'Building Backend...'
            dir(path: 'Autotracks/backend') {
              sh 'npm install'
            }

          }
        }

        stage('Build Frontend') {
          agent {
            docker {
              image 'node:14.16.1-alpine'
              args '''-p 5000 
-u root'''
            }

          }
          steps {
            echo 'Building Frontend...'
            dir(path: '../frontend') {
              sh 'npm install'
            }

          }
        }

      }
    }

    stage('Test') {
      agent {
        docker {
          image 'node:16.13.1-alpine'
          args '''-u root
-p 5000'''
        }

      }
      steps {
        echo 'Testing'
        dir(path: '../')
        dir(path: frontend) {
          sh 'npm test'
        }

      }
    }

    stage('Deliver') {
      agent {
        docker {
          image 'node:16.13.1-alpine'
          args '''-u root
-p 5000'''
        }

      }
      steps {
        echo 'Deploying Server'
        sh 'npm run serve'
      }
    }

  }
}