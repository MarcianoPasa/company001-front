pipeline {
    agent any

    environment {
        // Nome da imagem e do container no seu Docker Desktop
        DOCKER_IMAGE = "dradmin/company001-front:latest"
        CONTAINER_NAME = "company001-front-container"
    }

    stages {
        stage('Ambiente') {
            steps {
                echo "Iniciando build do Frontend em: ${WORKSPACE}"
                // Verifica se o Docker está acessível pelo Jenkins
                bat "docker version"
            }
        }

        stage('Checkout') {
            steps {
                // O Jenkins baixa o código do repositório configurado no Job
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Gerando nova imagem Docker do Angular 21...'
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Cleanup Old Deploy') {
            steps {
                script {
                    echo 'Removendo versão anterior do container...'
                    // O '|| ver > nul' impede que o pipeline falhe se o container não existir
                    bat "docker stop ${CONTAINER_NAME} || ver > nul"
                    bat "docker rm ${CONTAINER_NAME} || ver > nul"
                }
            }
        }

        stage('Deploy (Produção)') {
            steps {
                echo 'Subindo Frontend Company001 na porta 4200...'
                // Mapeia a porta 80 do Nginx interna para a 4200 do seu Windows
                bat "docker run -d --name ${CONTAINER_NAME} -p 4200:80 ${DOCKER_IMAGE}"
            }
        }
    }

    post {
        success {
            echo '----------------------------------------------------------'
            echo 'DEPLOY REALIZADO COM SUCESSO!'
            echo 'Acesse: http://localhost:4200/principal'
            echo '----------------------------------------------------------'
        }
        failure {
            echo 'Falha no Deploy do Frontend. Verifique os logs do Docker Build.'
        }
    }
}
