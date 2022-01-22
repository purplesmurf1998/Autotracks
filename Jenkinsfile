pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node:14.16.1-alpine'
          args '''-u root
-p 5000'''
        }

      }
      steps {
        echo 'Cloning Branch'
        sh '''node -v; export HOME=/tmp ;  npm config set cache /tmp;export HOME=/tmp ;  npm --prefix ./Server install
'''
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