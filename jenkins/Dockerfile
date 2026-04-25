FROM jenkins/jenkins:2.561

USER root

RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

USER jenkins

# Убираем инит запуск с дефолт паролями
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# Ставим плагины
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN JENKINS_UC="https://updates.jenkins.io" \
    jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Копируем конфиг JCasC
COPY --chown=jenkins:jenkins jenkins.yaml /var/jenkins_home/jenkins.yaml
