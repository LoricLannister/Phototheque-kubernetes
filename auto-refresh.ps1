# ============================================
# 🚀 Auto-refresh Kubernetes Deployment
# ============================================

# ⚙️ Variables à ajuster selon ton environnement
$deployment = "phototheque-web-deployment"
$namespace = "default"
$image = "loriclannister/phototheque-web:latest"
$intervalMinutes = 10

Write-Host "🚀 Auto-refresh de l'image Kubernetes lancé..." -ForegroundColor Green
Write-Host "Déploiement : $deployment"
Write-Host "Image       : $image"
Write-Host "Namespace   : $namespace"
Write-Host "Intervalle  : $intervalMinutes minutes"
Write-Host "--------------------------------------------"

while ($true) {
    Write-Host "🔄 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Mise à jour de l'image..." -ForegroundColor Cyan
    kubectl set image deployment/$deployment phototheque-web=$image -n $namespace | Out-Null

    Write-Host "♻️ Redémarrage du déploiement..." -ForegroundColor Yellow
    kubectl rollout restart deployment/$deployment -n $namespace | Out-Null

    Write-Host "⏳ Attente du déploiement en cours..." -ForegroundColor DarkYellow
    kubectl rollout status deployment/$deployment -n $namespace

    Write-Host "✅ Refresh terminé. Prochain check dans $intervalMinutes minutes." -ForegroundColor Green
    Write-Host "--------------------------------------------"

    Start-Sleep -Seconds ($intervalMinutes * 60)
}

# Dans powershell en mode admin, on autorise l'exécution de ce script
# Set-ExecutionPolicy RemoteSigned