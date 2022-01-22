pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node:16.13.1-alpine'
        }

      }
      steps {
        echo 'Cloning Branch'
        sh 'whoami'
        sh 'mkdir ~/.npm-global'
        sh '''npm config set prefix \'~/.npm-global\'
'''
        sh '''export PATH=~/.npm-global/bin:$PATH
'''
        sh '''source ~/.profile
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
        }

      }
      steps {
        echo 'Deploying Server'
        sh 'npm run serve'
      }
    }

  }
}