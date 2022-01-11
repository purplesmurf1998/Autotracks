pipeline {
  agent none
  stages {
    stage('Build') {
      steps {
        echo 'Cloning Branch'
        git(url: 'https://github.com/purplesmurf1998/Autotracks.git', branch: 'main', credentialsId: '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', poll: true)
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