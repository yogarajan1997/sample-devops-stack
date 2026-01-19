pipeline {
  agent any

  environment {
    REGISTRY = "10.0.0.11:5000"
    APP = "myapp"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/yogarajan1997/sample-devops-stack.git'
      }
    }

    stage('Build Images') {
      steps {
        sh '''
        docker build -t $REGISTRY/myapp-backend:${BUILD_NUMBER} backend
        docker build -t $REGISTRY/myapp-frontend:${BUILD_NUMBER} frontend
        '''
      }
    }

    stage('Push Images') {
      steps {
        sh '''
        docker push $REGISTRY/myapp-backend:${BUILD_NUMBER}
        docker push $REGISTRY/myapp-frontend:${BUILD_NUMBER}
        '''
      }
    }

    stage('Deploy DEV') {
      steps {
        sh '''
        helm upgrade --install myapp-dev deploy/helm/myapp \
          -n dev \
          -f deploy/helm/myapp/values-dev.yaml \
          --set image.tag=${BUILD_NUMBER}
        '''
      }
    }

    stage('Approve UAT') {
      steps {
        input message: 'Deploy to UAT?'
      }
    }

    stage('Deploy UAT') {
      steps {
        sh '''
        helm upgrade --install myapp-uat deploy/helm/myapp \
          -n uat \
          -f deploy/helm/myapp/values-uat.yaml \
          --set image.tag=${BUILD_NUMBER}
        '''
      }
    }

    stage('Approve PROD') {
      steps {
        input message: 'Deploy to PROD?'
      }
    }

    stage('Deploy PROD') {
      steps {
        sh '''
        helm upgrade --install myapp-prod deploy/helm/myapp \
          -n prod \
          -f deploy/helm/myapp/values-prod.yaml \
          --set image.tag=${BUILD_NUMBER}
        '''
      }
    }
  }
}
