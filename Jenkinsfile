node {
  when{changeset "Backend/*"}
  steps{
     stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def mvn = tool 'Default Maven';
    withSonarQubeEnv() {
      bat "${mvn}/bin/mvn clean verify sonar:sonar -Dsonar.projectKey=TrekTrip -Dsonar.projectName='TrekTrip'"
    }
  }
  }
}
