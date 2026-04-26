pipeline {
    agent {
        label 'docker-agent'
    }

    parameters {
        choice(name: "SERVICE", choices: ['frontend', 'backend'], description: 'Какой проект ?')
        string(name: "REALISE_NAME", defaultValue: "1.0.0", description: 'Версия:')
    }

    environment {
        REGISTRY = 'registry:5000'
        DOCKER_HOST = 'tcp://172.17.0.1:2375'
    }

	stages {
		stage('Build and Push Image') {
			steps {
                withCredentials([file(credentialsId: '${SERVICE}_env', variable: 'ENV_FILE')]) {
                    sh 'echo $ENV_FILE > ./frontend/.env'
                }
				sh 'docker build ./${SERVICE}/ -t ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
                sh 'docker push ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
			}
		}
    }
}
