#!/bin/bash
set -e

# Check if the kind cluster already exists
if kind get clusters | grep -q "kind"; then
  echo "Cluster 'kind' already exists. Skipping creation..."
else
  kind create cluster --wait 5m --config=./kind-config.yml
fi

kubectl cluster-info --context kind-istio-lab

# Show pods (for debugging)
kubectl get pods --all-namespaces

# OPTIONAL: install dashboard (commented out)
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml
# kubectl create clusterrolebinding default-admin --clusterrole cluster-admin --serviceaccount=default:default
# echo "Use following token for k8s dashboard"
# echo $(kubectl get secrets -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='default')].data.token}"|base64 --decode)
# sleep 10

# Download Istio if not already downloaded
if [ ! -d "./istio-1.19.0" ]; then
    curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.19.0 sh -
fi
export PATH=$PWD/istio-1.19.0/bin:$PATH

# Create istio-system namespace if it doesn't exist
if ! kubectl get namespace istio-system > /dev/null 2>&1; then
  kubectl create namespace istio-system
else
  echo "Namespace 'istio-system' already exists. Skipping creation..."
fi

# Apply kiali secret
kubectl apply -f kiali-secret.yml

echo "Installing Istio Operator"
istioctl operator init
kubectl -n istio-operator wait --for=condition=available --timeout=600s deployment/istio-operator

echo "Installing Istio Controlplane"
kubectl apply -f istio.yml
sleep 20  # let the operator pick up the configuration
kubectl -n istio-system wait --for=condition=available --timeout=600s deployment/istiod

echo "Installing Prometheus"
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/prometheus.yaml || :

echo "Installing Kiali"
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/kiali.yaml || :

# Patch Kiali service only if necessary (you may also check for existence of NodePort if desired)
kubectl -n istio-system patch svc kiali --patch '{"spec": { "type": "NodePort", "ports": [ { "name": "http", "nodePort": 30123, "port": 20001, "protocol": "TCP", "targetPort": 20001 }, { "name": "http-metrics", "nodePort": 30333, "port": 9090, "protocol": "TCP", "targetPort": 9090 } ] } }'

echo "Installing Flagger"
kubectl apply -k github.com/weaveworks/flagger//kustomize/istio

# Wait for add-ons to be available
kubectl -n istio-system wait --for=condition=available --timeout=600s deployment/prometheus
kubectl -n istio-system wait --for=condition=available --timeout=600s deployment/kiali
kubectl -n istio-system wait --for=condition=available --timeout=600s deployment/flagger

# Enable sidecar injection on default namespace if not already enabled
if kubectl get namespace default -o jsonpath='{.metadata.labels.istio-injection}' | grep -q "enabled"; then
  echo "Namespace 'default' already labeled for Istio injection"
else
  kubectl label namespace default istio-injection=enabled
fi

sleep 2

# Install Flagger components
kubectl apply -f ../flagger/deployment.yml
kubectl apply -f ../flagger/canary.yml

# Open up additional deployments
cd ../deployments
./install.sh

# (Optional) Show all pods after deployment
kubectl get pods --all-namespaces
