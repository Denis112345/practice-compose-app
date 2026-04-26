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
                withCredentials([file(credentialsId: "frontend_env", variable: "ENV_FILE")]) {
                    sh "cp \$ENV_FILE ./frontend/.env"
                }
                withCredentials([file(credentialsId: "backend_env", variable: "ENV_FILE")]) {
                    sh "cp \$ENV_FILE ./backend/.env"
                }
                withCredentials([file(credentialsId: "compose_env", variable: "ENV_FILE")]) {
                    sh "cp \$ENV_FILE .env"
                }

				sh "docker build --no-cache ./${params.SERVICE}/ -t ${REGISTRY}/${params.SERVICE}:${params.REALISE_NAME}"
                sh "docker push ${REGISTRY}/${params.SERVICE}:${params.REALISE_NAME}"

                withCredentials([string(credentialsId: "local_ip_host", variable: "HOST_IP")]) {
                    sh 'docker -H $HOST_IP:2375 pull localhost:5000/$SERVICE:$REALISE_NAME'
                    sh 'docker -H $HOST_IP:2375 compose up -d --force-recreate $SERVICE'
                }
			}
		}
    }
}
