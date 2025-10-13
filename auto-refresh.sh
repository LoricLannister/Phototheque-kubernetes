#!/bin/bash

# Nom du déploiement et namespace
DEPLOYMENT="phototheque-web-deployment"
NAMESPACE="default"
IMAGE="loriclannister/phototheque-web:latest"

echo "🚀 Auto-refresh de l'image Kubernetes lancé..."
echo "   Déploiement : $DEPLOYMENT"
echo "   Image       : $IMAGE"
echo "   Namespace   : $NAMESPACE"
echo "--------------------------------------------"

# Boucle infinie pour surveiller et rafraîchir périodiquement
while true; do
  echo "🔄 $(date '+%Y-%m-%d %H:%M:%S') - Mise à jour de l'image..."
  kubectl set image deployment/$DEPLOYMENT phototheque-web=$IMAGE -n $NAMESPACE >/dev/null 2>&1

  echo "♻️ Redémarrage du déploiement..."
  kubectl rollout restart deployment/$DEPLOYMENT -n $NAMESPACE >/dev/null 2>&1

  echo "⏳ Attente du déploiement..."
  kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

  echo "✅ Refresh terminé. Prochain check dans 10 minutes."
  echo "--------------------------------------------"

  # Attente avant la prochaine itération
  sleep 600  # 10 minutes
done

# Dans le terminal
# chmod +x auto-refresh.sh
# ./auto-refresh.sh