pipeline {
	agent any
		stages {
			stage('Checkout') {
				steps {
					checkout scm
				}
			}
			stage('Install Dependencies') {
				steps {
					sh 'npm ci'
				}
			}
			stage('Test') {
				steps {
					sh 'npm test -- --watchAll=false'
				}
			}
			stage('React Build') {
				steps {
					sh 'npm run build'
				}
			}
			stage('Docker Build') {
				steps {
					sh 'docker build -t my-react-app:${BUILD_NUMBER} .'
				}
			}
		}
	}
				
		
