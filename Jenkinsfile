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
			stage('React Build') {
				steps {
					sh 'npm run build'
				}
			}
			stage('Docker Build') {
				steps {
					sh 'docker build -t vijayapranav/end_to_end_react_app:v1.0.${BUILD_NUMBER} .'
				}
			}
			stage('Docker Push') {
				steps {
					withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',usernameVariable: 'DOCKERHUB_USERNAME',passwordVariable: 'DOCKERHUB_PASSWORD')]) {
					sh '''
						echo "$DOCKERHUB_PASSSWORD" | docker login -u "$DOCKERHUB_USERNAME" ==password-stdin
						docker push vijayapranav/end_to_end_react_app:v1.0.${BUILD_NUMBER}
						docker logout
					'''
				}
			}
		}
	}
				
		
