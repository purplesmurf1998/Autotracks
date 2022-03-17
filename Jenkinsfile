pipeline {
  agent none
  stages {
    stage('Build & Test') {
      parallel {
        stage('Frontend') {
          agent {
            docker {
              args '''-u root -p 8080'''
              image 'node:14.18.3-alpine'
            }
          }
          steps {
            echo 'Building Frontend...'
            dir(path: 'frontend') {
              sh 'npm install --force'
              echo 'Running Unit Tests...'
              sh 'npm run test:unit'
              echo 'Running End-To-End Tests...'
              sh 'npm run test:e2e'
              echo 'Build & Test Complete In Front End'
            }
          }
        }//END FRONTEND STAGE
        stage('Backend') {
          agent {
            docker {
              args '''-u root -p 5000'''
              image 'node:14.18.3-alpine'
            }
          }
          steps {
            echo 'Building Backend...'
            dir(path: 'backend') {
              sh 'npm install --force'
              echo 'Running Unit Tests...'
              sh 'npm run test'
              echo 'Build & Test Complete In Front End'
            }
          }
        }//END BACKEND STAGE
      }//END PARALLEL
    }//END BUILD & TEST
    stage('Deploy & Serve') {
      parallel {
        stage('Frontend') {
          agent {
            docker {
              args '''-u root -p 8080'''
              image 'node:14.18.3-alpine'
            }
          }
          steps {
            echo 'Building Frontend...'
            dir(path: 'frontend') {
              sh 'npm install --force'
              echo 'Running linter...'
              sh 'npm run lint'
              echo 'Running Unit Tests...'
              sh 'npm run test:unit'
              echo 'Running End-To-End Tests...'
              sh 'npm run test:e2e'
              echo 'Running Front end server...'
              sh 'npm run serve'
            }
            echo 'Frontend Server Deployed on port 8080'
          }
        }//END FRONTEND STAGE
        stage('Backend') {
          agent {
            docker {
              args '''-u root -p 5000'''
              image 'node:14.18.3-alpine'
            }
          }
          steps {
            echo 'Building Backend...'
            dir(path: 'backend') {
              sh 'npm install --force'
              echo 'Running Unit Tests...'
              echo'Skipping testing...'//sh 'npm run test'
              echo 'Running Node Server...'
              sh 'ls'
              sh 'node server'
            }
            echo 'Backend Server Deployed on port 5000'
          }
        }//END BACKEND STAGE
      }//END PARALLEL
    }//END Deploy & Serve

  }
}