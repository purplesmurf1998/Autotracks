pipeline {
  agent none
  stages {
      parallel {
        stage('Build') {
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
            dir(path: '../frontend') {
              sh 'npm install --force'
            }

          }
        }

      
    

    stage('Test') {
          agent {
            docker {
              args '''-u root 
-p 5000'''
              image 'node:14.18.3-alpine'
            }

          }
          steps {
            echo 'Testing Frontend'
            dir(path: '../')
            dir(path: 'Autotracks/backend') {
              sh 'npm test'
            }
            echo 'Testing Backend'
            dir(path: 'Autotracks/frontend') {
              sh 'npm test'
            }

          }
        }

      
    

    stage('Deliver') {
        agent {
            docker {
              args '''-u root 
-p 5000'''
              image 'node:14.18.3-alpine'
            }

          }
          steps {
            echo 'Deploying Server'
            dir(path: 'Autotracks/frontend') {
              sh 'npm build'
              sh 'npm run serve'
            }
            echo 'Deploying Backend'
            dir(path: 'Autotracks/backend') {
              sh 'npm build'
              sh 'node server.js'
            }

          }

      }
    


  
}
    }
  }