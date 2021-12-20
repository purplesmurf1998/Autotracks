pipeline {
    agent {
        docker {
            image 'node:lts-buster-slim'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building Backend...'
                dir(backend){
                    sh 'npm install'
                }
                echo 'Building Frontend...'
                dir(frontend){
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing Backend...'
                dir(backend){
                    sh 'npm test'
                }
                echo 'Testing Backend...'
                dir(frontend){
                    sh 'npm test'
                }
            }
        }
        stage('Deliver') { 
            steps {
                echo 'Deploying....'
            }
        }
    }
}
