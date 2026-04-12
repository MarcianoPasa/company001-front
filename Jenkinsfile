stage('Build Angular') {
    steps {
        bat 'npm install'
        bat 'npm run build --configuration production'
    }
}

stage('Build Docker Image') {
    steps {
        bat 'docker build -t company001-front .'
    }
}

stage('Run Container') {
    steps {
        bat '''
        docker rm -f company001-front || exit 0
        docker run -d -p 80:80 --name company001-front company001-front
        '''
    }
}
