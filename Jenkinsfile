pipeline {
    agent any
  
    tools {nodejs "Node 14.8.1"}
  
    stages {
        stage('Build') {
            steps {
                echo 'Building backend...'
                dir(backend){
                    npm install
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                dir(backend){
                    npm test
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
