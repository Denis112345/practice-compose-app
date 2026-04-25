pipeline {
    agent {
        label 'docker-agent'
    }

    parametres {
        choice(name: "SERVICE", choices: ['frontend', 'backend'], description: 'Какой проект ?')
        string(name: "REALISE_NAME", defaultValue: "1.0.0", description: 'Версия:')
    }

    environment {
        REGISTRY = 'registry:5000'
    }

	stages {
		stage('Build and Push Image') {
			steps {
				sh 'docker build ./${SERVICE}/ -t ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
                sh 'docker push ${REGISTRY}/${SERVICE}:${REALISE_NAME}'
			}
		}
    }
}