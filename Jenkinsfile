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
        DOCKER_HOST = 'tcp://docker-dind:2375'
    }

	stages {
		stage('Build and Push Image') {
			steps {
                sh '''
                    if command -v apk >/dev/null; then
                        apk add --no-cache docker-cli
                    else
                        sudo apt-get update && sudo apt-get install -y docker.io
                    fi
                '''
				sh 'docker build ./${SERVICE}/ -t ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
                sh 'docker push ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
			}
		}
    }
}