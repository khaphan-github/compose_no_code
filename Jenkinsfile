// https://hackmamba.io/blog/2022/04/running-docker-in-a-jenkins-container/
pipeline {
    agent any
    tools {
        nodejs "node_18.10.0"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    stages {
        stage('Clone and install dependencies') {
            steps {
                sh 'pwd'
                dir('web-gen-no-code') {
                    echo 'Install dependencies web'
                    sh 'rm -f package-lock.json'
                    sh 'rm -f yarn.lock'
                    sh 'npm install'
                }

                dir('api-gen-no-code') {
                    echo 'Install dependencies web'
                    sh 'rm -f package-lock.json'
                    sh 'rm -f yarn.lock'
                    sh 'npm install --force'
                }
            }
        }
        
        stage('Unit testing') {
            steps {
                script {
                    echo "Unit test web"
                }
            }
        }
        
        stage('Interation testing') {
            steps {
                script {
                    echo "Interation test web"
                }
            }
        }
        
        stage('Build docker image') {
            steps {
                script {
                    sh 'docker login -u 2080600383 -p dckr_pat_Ncjn05tI2RuONzqreP4T4tzNv1U'
                    
                    dir('web-gen-no-code') {
                        sh 'docker rmi -f 2080600383/low-code-angular16-web'
                        sh 'docker build -t 2080600383/low-code-angular16-web .'

                        sh 'docker login -u 2080600383 -p dckr_pat_Ncjn05tI2RuONzqreP4T4tzNv1U'
                        sh 'docker push 2080600383/low-code-angular16-web'
                        echo "Build web done nice"
                    }

                    dir('api-gen-no-code') {
                        sh 'docker rmi -f 2080600383/low-code-angular16-api'
                        sh 'docker build -t 2080600383/low-code-angular16-api .'
                        sh 'docker push 2080600383/low-code-angular16-api'
                        echo "Build api done nice"
                    }
                }
            }
        }
        
        stage('Deploy web') {
            steps {
                script {
                   dir('web-gen-no-code') {
                        
                    }
                }
            }
        }
    }
}

