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
                sh "docker build -t vijayapranav/end_to_end_react_app:v1.0.${BUILD_NUMBER} ."
            }
        }
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh """
                        echo "\$DOCKERHUB_PASSWORD" | docker login -u "\$DOCKERHUB_USERNAME" --password-stdin
                        docker push vijayapranav/end_to_end_react_app:v1.0.${BUILD_NUMBER}
                        docker logout
                    """
                }
            }
	}
	stage('Update GitOps Repository') {
		steps {
			withCredentials([usernamePassword(credentialsId: 'github-gitops-credentials', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')]) 
			{
			sh """ rm -rf gitops
				git clone https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/VijayaPranav/end_to_end_react_gitops gitops
				cd gitops
				sed -i "s|image: vijayapranav/end_to_end_react_app:.*image: vijayapranav/end_to_end_react_app:v1.0.${BUILD_NUMBER}|" deployment.yaml
				git config user.name "Jenkins"
				git config user.email "jenkins@localhost"
				git add deployment.yaml
				if git diff --cached --quiet; then
					echo "No changes to commit"
				else
					git commit -m "Update React image to v1.0.${BUILD_NUMBER}"
					git push origin main
				fi
			 """
			}
		}
         }
	}
}

