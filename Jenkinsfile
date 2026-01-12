pipeline {
  agent any

  environment {
    REGISTRY = "20.199.160.5:5000"
    BACKEND_IMAGE = "${REGISTRY}/myapp-backend"
    FRONTEND_IMAGE = "${REGISTRY}/myapp-frontend"
    GIT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Tests") {
      steps {
        dir("backend") {
          sh "npm ci"
          sh "npm test"
        }
        dir("frontend") {
          sh "npm ci"
          sh "npm test"
        }
      }
    }

    stage("Build Docker Images") {
      steps {
        sh "docker build -t ${BACKEND_IMAGE}:${GIT_SHA} ./backend"
        sh "docker build -t ${FRONTEND_IMAGE}:${GIT_SHA} ./frontend"
      }
    }

    stage("Scan Images (Trivy)") {
      steps {
        sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${BACKEND_IMAGE}:${GIT_SHA}"
        sh "trivy image --severity HIGH,CRITICAL --exit-code 1 ${FRONTEND_IMAGE}:${GIT_SHA}"
      }
    }

    stage("Push Images") {
      steps {
        sh "docker push ${BACKEND_IMAGE}:${GIT_SHA}"
        sh "docker push ${FRONTEND_IMAGE}:${GIT_SHA}"
      }
    }

    stage("Deploy DEV (Auto)") {
      steps {
        sh """
          helm upgrade --install myapp ./deploy/helm/myapp -n dev --create-namespace \
            -f ./deploy/helm/myapp/values-dev.yaml \
            --set image.tag=${GIT_SHA}
        """
      }
    }

    stage("Deploy UAT (Approval)") {
      steps {
        input message: "Approve deployment to UAT?", ok: "Deploy UAT"
        sh """
          helm upgrade --install myapp ./deploy/helm/myapp -n uat --create-namespace \
            -f ./deploy/helm/myapp/values-uat.yaml \
            --set image.tag=${GIT_SHA}
        """
      }
    }

    stage("Deploy PROD (Approval)") {
      steps {
        input message: "Approve deployment to PROD?", ok: "Deploy PROD"
        sh """
          helm upgrade --install myapp ./deploy/helm/myapp -n prod --create-namespace \
            -f ./deploy/helm/myapp/values-prod.yaml \
            --set image.tag=${GIT_SHA}
        """
      }
    }
  }
}
