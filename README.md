# End-to-End React CI/CD Pipeline with Jenkins, Docker, Kubernetes and Argo CD

An end-to-end DevOps and GitOps pipeline for deploying a containerized React application to a K3s Kubernetes cluster.
The project implements Continuous Integration using Jenkins and Continuous Delivery using a GitOps workflow with GitHub and Argo CD.

---

## Architecture

```text
                         CI / CD + GitOps Pipeline

 Developer
     |
     | git push
     v
+-----------------------+
| GitHub Application     |
| Repository             |
| React + Dockerfile     |
| Jenkinsfile            |
+-----------+-----------+
            |
            | GitHub Webhook
            v
+-----------------------+
| Jenkins               |
|                       |
| npm ci                |
| npm run build         |
| Docker build          |
| Docker push           |
+-----------+-----------+
            |
            v
+-----------------------+
| Docker Hub            |
| React Application     |
| Container Image       |
+-----------------------+
            |
            | Jenkins updates
            | deployment.yaml
            v
+-----------------------+
| GitHub GitOps         |
| Repository            |
|                       |
| deployment.yaml       |
| service.yaml          |
| ingress.yaml          |
+-----------+-----------+
            |
            | Git polling / webhook
            v
+-----------------------+
| Argo CD               |
| GitOps CD             |
+-----------+-----------+
            |
            v
+-----------------------+
| K3s Kubernetes        |
| Cluster               |
|                       |
| Deployment            |
| Service               |
| Traefik Ingress       |
+-----------+-----------+
            |
            v
+-----------------------+
| React Application     |
| http://react.local    |
+-----------------------+

Technologies Used
Technology	        |          Purpose
React	                      Frontend application
GitHub	                    Source code and GitOps repositories
Jenkins	                    Continuous Integration
npm	                        Dependency management and application build
Docker	                    Application containerization
Docker Hub	                Container image registry
Kubernetes	                Container orchestration
K3s	                        Lightweight Kubernetes distribution
Argo CD	                    GitOps-based Continuous Delivery
Traefik	                    Kubernetes Ingress Controller
ngrok	                      GitHub webhook tunneling to local Jenkins

Repository Structure

The project uses two separate GitHub repositories.

Application Repository
end_to_end_react_app/
├── React application files
├── Dockerfile
└── Jenkinsfile
This repository contains the application source code and CI pipeline definition.

GitOps Repository
end_to_end_react_gitops/
├── deployment.yaml
├── service.yaml
└── ingress.yaml
This repository contains the desired Kubernetes state along with the ingress controller.

CI/CD Workflow

1. Developer Push
A developer pushes application changes to the application GitHub repository.
Example:
  git add .
  git commit -m "Update React application"
  git push

2. GitHub Webhook
GitHub sends a push event to Jenkins.
During local development, ngrok exposes Jenkins to GitHub:
GitHub
   |
   v
ngrok
   |
   v
Jenkins :8080

Webhook endpoint:
/github-webhook/

3. Jenkins Continuous Integration
Jenkins executes the following stages:

3.a Checkout
    The latest application source code is retrieved.
    Install Dependencies
    npm ci

3.b React Build
    npm run build

3.c Docker Build
    A versioned Docker image is created using the Jenkins build number.
    Example:
      vijayapranav/end_to_end_react_app:v1.0.15

3.d Docker Push
    The image is pushed to Docker Hub.

4. GitOps Continuous Delivery
After pushing the Docker image, Jenkins updates the image reference in the GitOps repository.
For example:
image: vijayapranav/end_to_end_react_app:v1.0.15

Jenkins commits the change:
Update React image to v1.0.15
and pushes it to the GitOps repository.

Argo CD
Argo CD monitors the GitOps repository.
When the desired state changes, Argo CD synchronizes the Kubernetes cluster.
GitOps Repository
       |
       v
     Argo CD
       |
       v
      K3s

Therefore:
Jenkins----->CI
Argo CD----->CD
GitHub GitOps Repository -----> Desired State(Single source of truth)
Kubernetes -----> Runtime Environment

Kubernetes Components

Deployment
deployment.yaml manages the React application pods.
The deployment uses the Docker Hub image:
image: vijayapranav/end_to_end_react_app:<VERSION>

Kubernetes performs rolling updates when the image version changes.

Service
service.yaml exposes the React pods internally within Kubernetes.
The service forwards traffic to port:3000

Ingress
ingress.yaml configures Traefik to route HTTP requests to the React service.
Browser
   |
   | http://react.local
   v
Traefik
   |
   v
my-react-app-service
   |
   v
React Pods

Accessing the Application
The application is available through:
http://react.local

The hostname is mapped to the K3s node using the local /etc/hosts file.

# Useful Kubernetes Commands

Check cluster nodes: kubectl get nodes

Check application pods: kubectl get pods

Check deployment: kubectl get deployment

Check services: kubectl get svc

Check ingress: kubectl get ingress

Argo CD Access

The Argo CD server can be accessed locally using: kubectl port-forward svc/argocd-server -n argocd 8081:443

Then open:
https://localhost:8081 to view the running application

Deployment Verification
After a new application version is pushed, verify the following:

Jenkins
The pipeline should complete successfully:
Checkout                  SUCCESS
Install Dependencies      SUCCESS
React Build               SUCCESS
Docker Build              SUCCESS
Docker Push               SUCCESS
Update GitOps Repository  SUCCESS

Docker Hub
The new image tag should be present:
v1.0.X

GitHub GitOps
deployment.yaml should contain the new image version.

Argo CD
The application should show:
Healthy
Synced

Kubernetes
The new pods should be running:
kubectl get pods

Application
The updated React application should be visible at:
http://react.local

Key Design Decisions:

Separate Application and GitOps Repositories
The application source code and Kubernetes manifests are maintained separately.
This provides a clean separation between:
- Application development
- Infrastructure/deployment configuration

Immutable Docker Tags
Docker images are tagged using Jenkins build numbers:
v1.0.1
v1.0.2
v1.0.3
...
This makes deployments traceable and avoids relying on a mutable latest tag.

GitOps-Based Deployment
Jenkins does not directly execute: kubectl apply

Instead, Jenkins updates the GitOps repository.
Argo CD detects the Git change and performs the deployment.
This follows the GitOps model where Git acts as the single source of truth for the desired Kubernetes state.

Project Highlights

- Automated CI pipeline using Jenkins
- Docker-based application packaging
- Automated Docker Hub image publishing
- Separate GitOps repository
- Automated Kubernetes deployment through Argo CD
- K3s-based Kubernetes cluster
- Traefik Ingress
- Versioned container images
- Automated rolling updates
- End-to-end GitHub → Jenkins → Docker Hub → GitOps → Argo CD → Kubernetes workflow

Future Improvements
Possible future enhancements include:
- Prometheus and Grafana monitoring
- HTTPS/TLS for the application
- Automated rollback
- Argo CD notifications
- Jenkins build notifications
- Kubernetes resource limits
- Automated security scanning of Docker images
- Infrastructure provisioning using Terraform


