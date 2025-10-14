#!/bin/bash
set -e

echo "🔄 Mise a jour de l'image dans le déploiement phototheque-web-deployment..."
kubectl set image deployment/phototheque-web-deployment phototheque-web=loriclannister/phototheque-web:latest --namespace=default

echo "♻️ Redemarrage du deploiement pour forcer le pull de l'image..."
kubectl rollout restart deployment/phototheque-web-deployment --namespace=default

echo "⏳ Attente du deploiement..."
kubectl rollout status deployment/phototheque-web-deployment --namespace=default

echo "✅ Rafraichissement termine."
