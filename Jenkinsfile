// https://hackmamba.io/blog/2022/04/running-docker-in-a-jenkins-container/
pipeline {
    agent any
    tools {
        nodejs "node_18.10.0"
    }
    environment {
      WEB_DOCKER_IMAGE = "2080600383/low-code-angular16-web:lastest"
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

                        sh 'docker image rm ${DOCKER_IMAGE_NAME}'
                        sh 'docker build -t ${DOCKER_IMAGE_NAME}'

                        sh 'docker tag ${DOCKER_IMAGE_NAME} ${DOCKER_IMAGE_NAME}'

                        sh 'docker login -u ${DOCKER_HUB_USERNAME} -p ${JENKINS_DOCKER_ACCESS_TOKEN}'
                        sh 'docker push ${DOCKER_IMAGE_NAME}'

                        echo "Deploy web done nice"
                    }
                }
            }
        }
    }
}

