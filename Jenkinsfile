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
                        
                        // Tagging the Docker image
                        def versionTag = "v1.0.0"
                        def dockerImage = docker.image("${WEB_DOCKER_IMAGE}")
                        dockerImage.tag(versionTag)

                        docker.withRegistry('https://index.docker.io/v1/', 'JENKINS_DOCKER_ACCESS_TOKEN') {
                            dockerImage.push()
                        }
                        
                        echo "Deploy web done nice"
                    }
                }
            }
        }
    }
}

