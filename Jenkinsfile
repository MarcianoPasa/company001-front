pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Angular') {
      steps {
        bat 'npm install'
        bat 'npm run build --configuration production'
      }
    }

    stage('Docker Build') {
      steps {
        bat 'docker build -t company001-front .'
      }
    }

    stage('Run Container') {
      steps {
        bat 'docker run -d -p 80:80 --name company001-front company001-front'
      }
    }
  }
}
