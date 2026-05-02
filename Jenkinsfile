@Library('my-shared-library') _

pipeline {
    agent {
        label 'docker-agent'
    }

    post {
        beforeAgent {
            showContentFile("txt/db.conf")
        }
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
                copyEnvFile("frontend_env", "ENV_FILE", "./frontend/.env")
                copyEnvFile("backend_env", "ENV_FILE", "./backend/.env")
                copyEnvFile("compose_env", "ENV_FILE", ".env")

				sh "docker build --no-cache ./${params.SERVICE}/ -t ${REGISTRY}/${params.SERVICE}:${params.REALISE_NAME}"
                sh "docker push ${REGISTRY}/${params.SERVICE}:${params.REALISE_NAME}"

                withCredentials([string(credentialsId: "local_ip_host", variable: "HOST_IP")]) {
                    sh 'docker -H $HOST_IP:2375 pull localhost:5000/$SERVICE:$REALISE_NAME'
                    sh 'docker -H $HOST_IP:2375 compose -p practice-compose-app up -d --no-deps --force-recreate $SERVICE'
                }
			}
		}
    }
}
