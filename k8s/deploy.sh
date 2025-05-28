# helm install resrv ./k8s/resrv/
# rm ./k8s/resrv/templates/**/* # Clean Templates Folder
# > ./k8s/resrv/values.yaml # Clean Values File

function set_access_key {
  kubectl create secret docker-registry $1 --docker-server=$2 --docker-username=_json_key --docker-password="$(cat /secrets/gcloud-artifact-reader.json)" --docker-email=$3
  kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "$1"}]}'
}

# Uninstall Current Project
if helm get manifest resrv; then
  echo "Uninstalling Current Project"
  helm uninstall resrv
fi

# Setup JSON Key for Access
if kubectl get secret | grep -q "gcr-json-key"; then
  echo "Using Previously Defined Secret"
else
  set_access_key gcr-json-key us-east4-docker.pkg.dev oknott2000@gmail.com
fi

# Create Reservations Deployment from Image
if kubectl get deployment reservations; then
  kubectl rollout restart deployment reservations
else
  docker pull us-east4-docker.pkg.dev/resrv-455422/reservations/production
  kubectl create deployment reservations --image=us-east4-docker.pkg.dev/resrv-455422/reservations/production --dry-run=client -o yaml > ./k8s/resrv/templates/reservations/deployment.yaml
fi

# Install Deployments
helm install resrv ./k8s/resrv