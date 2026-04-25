FROM jenkins/jenkins:jdk17

USER root

COPY --from=docker:27-cli /usr/local/bin/docker /usr/local/bin/docker
RUN mkdir -p /var/jenkins_home && chown -R jenkins:jenkins /var/jenkins_home
RUN chmod +x /usr/local/bin/docker

USER jenkins

ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
ENV CASC_JENKINS_CONFIG="/usr/share/jenkins/ref/jenkins.yaml"

# Копируем список плагинов
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt

RUN jenkins-plugin-cli --verbose --plugin-file /usr/share/jenkins/ref/plugins.txt

COPY --chown=jenkins:jenkins jenkins.yaml /usr/share/jenkins/ref/jenkins.yaml
