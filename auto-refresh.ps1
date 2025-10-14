# ============================================
# 🚀 Auto-refresh Kubernetes Deployment
# ============================================

# ⚙️ Variables à ajuster selon ton environnement
$deployment = "phototheque-web-deployment"
$namespace = "default"
$image = "loriclannister/phototheque-web:latest"
$intervalMinutes = 3

Write-Host "🚀 Auto-refresh de l'image Kubernetes lance..." -ForegroundColor Green
Write-Host "Deploiement : $deployment"
Write-Host "Image       : $image"
Write-Host "Namespace   : $namespace"
Write-Host "Intervalle  : $intervalMinutes minutes"
Write-Host "--------------------------------------------"

while ($true) {
    Write-Host "🔄 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Mise a jour de l'image..." -ForegroundColor Cyan
    kubectl set image deployment/$deployment phototheque-web=$image -n $namespace | Out-Null

    Write-Host "♻️ Redemarrage du deploiement..." -ForegroundColor Yellow
    kubectl rollout restart deployment/$deployment -n $namespace | Out-Null

    Write-Host "⏳ Attente du deploiement en cours..." -ForegroundColor DarkYellow
    kubectl rollout status deployment/$deployment -n $namespace

    Write-Host "✅ Refresh termine. Prochain check dans $intervalMinutes minutes." -ForegroundColor Green
    Write-Host "--------------------------------------------"

    Start-Sleep -Seconds ($intervalMinutes * 60)
}

# Dans powershell en mode admin, on autorise l'exécution de ce script
# Set-ExecutionPolicy RemoteSigned