# helm install resrv ./k8s/resrv/
# rm ./k8s/resrv/templates/**/* # Clean Templates Folder
# > ./k8s/resrv/values.yaml # Clean Values File

function set_access_key {
  kubectl create secret docker-registry $1 --docker-server=$2 --docker-username=_json_key --docker-password="$(cat /secrets/gcloud-artifact-reader.json)" --docker-email=$3
  kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "$1"}]}'
}

function create_deployment {
  echo "Deploying $1"
  if kubectl get deployment $1; then
    kubectl rollout restart deployment $1
  elif ls ./k8s/resrv/templates/$1/deployment.yaml; then
    echo "Using existing deployment template for $1"
  else
    # docker pull us-east4-docker.pkg.dev/resrv-455422/$1/production
    mkdir ./k8s/resrv/templates/$1
    kubectl create deployment $1 --image=us-east4-docker.pkg.dev/resrv-455422/$1/production --dry-run=client -o yaml > ./k8s/resrv/templates/$1/deployment.yaml
    sed -i "s/name: production/name: $1/g" ./k8s/resrv/templates/$1/deployment.yaml
  fi
}

# Uninstall Current Project


# Setup JSON Key for Access
if kubectl get secret | grep -q "gcr-json-key"; then
  echo "Using Previously Defined Secret"
else
  set_access_key gcr-json-key us-east4-docker.pkg.dev oknott2000@gmail.com
fi

# Create Reservations Deployment from Image
create_deployment reservations
create_deployment auth
create_deployment notifications
create_deployment payments

# Install or Upgrade Helm
if helm get manifest resrv; then
  echo "Upgrading RESRV"
  helm upgrade resrv ./k8s/resrv
else
  echo "Installing RESRV"
  helm install resrv ./k8s/resrv
fi