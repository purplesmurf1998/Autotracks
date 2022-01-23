pipeline {
  agent none
  stages {
    stage('Build ') {
      parallel {
        stage('Build Backend') {
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

          }
        }

        stage('Build Frontend') {
          agent {
            docker {
              args '-p 5000 -u root'
              image 'node:14.18.3-alpine'
            }

          }
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
      parallel {
        stage('Test') {
          agent {
            docker {
              args '''-p 5000
-u root'''
              image 'node:14.18.3-alpine'
            }

          }
          steps {
            echo 'Testing Frontend'
            dir(path: '../')
            dir(path: Autotracks/backend) {
              sh 'npm test'
            }

          }
        }

        stage('') {
          agent {
            docker {
              image 'node:14.18.3-alpine'
              args '''-p 5000
-u root'''
            }

          }
          steps {
            echo 'Testing Backend'
            dir(path: 'Autotracks/frontend') {
              sh 'npm test'
            }

          }
        }

      }
    }

    stage('Deliver') {
      parallel {
        stage('Deliver') {
          agent {
            docker {
              args '''-p 5000
-u root'''
              image 'node:14.18.3-alpine'
            }

          }
          steps {
            echo 'Deploying Server'
            dir(path: 'Autotracks/frontend') {
              sh 'npm run serve'
            }

          }
        }

        stage('') {
          steps {
            echo 'Deploying Backend'
            dir(path: 'Autotracks/backend') {
              sh 'node server.js'
            }

          }
        }

      }
    }

    stage('') {
      steps {
        warnError(catchInterruptions: true, message: 'Error Found in Pipeline')
        echo 'Built and deployed'
      }
    }

  }
}