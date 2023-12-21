// https://hackmamba.io/blog/2022/04/running-docker-in-a-jenkins-container/
pipeline {
    agent any
    tools {
        nodejs "node_18.10.0"
    }
    environment {
      WEB_DOCKER_IMAGE = "low-code/angular16-web"
      DOCKERHUB_CREDENTIALS = credentials('JENKINS_DOCKER_ACCESS_TOKEN')
      PATH = "$PATH:/usr/local/bin"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    stages {
        stage('Clone Repository') {
            steps {
                dir('web-gen-no-code') {
                    echo 'execute-pipe-test_v1'
                    sh 'rm -f package-lock.json'
                    sh 'rm -f yarn.lock'
                    sh 'npm install'
                }
            }
        }
        
        stage('Unit test web') {
            steps {
                script {
                    // Run SonarQube analysis
                    echo "Unit test web"
                }
            }
        }
        
        stage('Interation test web') {
            steps {
                script {
                    // Run SonarQube analysis
                    echo "Interation test web"
                }
            }
        }
        
        stage('Build web') {
            steps {
                script {
                    dir('web-gen-no-code') {
                        echo "Build web"
                        // sh "npm run build"
                    }
                }
            }
        }
        
        stage('Deploy web') {
            steps {
                script {
                   dir('web-gen-no-code') {
                        echo "Deploy web"
                        docker.build("${WEB_DOCKER_IMAGE}")
                        docker.withRegistry('https://registry.hub.docker.com', 'JENKINS_DOCKER_ACCESS_TOKEN') {
                          docker.image("${WEB_DOCKER_IMAGE}").push()
                        }
                        echo "Deploy web done nice"
                    }
                }
            }
        }
    }
}

