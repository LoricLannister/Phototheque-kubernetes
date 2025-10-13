FROM node:latest

# Créer le répertoire de travail de l'application dans le conteneur
WORKDIR /usr/src/app
# Copier le package.json et installer les dépendances
COPY package.json .
RUN npm install
# Copier tous les fichiers de l'application dans le conteneur
COPY . .
# Définir la variable d'environnement MongoDB
ENV MONGO_URI="mongodb://mongos-service:27017/phototheque"
ENV MONGO_TEST_URI="mongodb://mongos-service:27017/phototheque_test"
# Ancienne Url de connexion avec mongoDb en local "mongodb://host.docker.internal:27017/phototheque"
# Exposer le port sur lequel l'application s'exécute
EXPOSE 3003

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]

# On build l'image
# docker build -t phototheque-web:1.0 .
# On crée un pod pour notre app
# kubectl apply -f pods.yaml
# On teste le pod via port forwarding
# kubectl port-forward pod/phototheque-web-pod 3003:3003
# On crée ensuite un déploiement pour scaler et mettre à jour facilement
# kubectl apply -f deployment.yaml
# On crée enfin un service pour exposer notre pod à l'extérieur via <NodeIp>:<NodePort> et on n'y accède via localhost:<NodePort>
# kubectl apply -f service.yaml
# kubectl get services
# NB: le port 3003 utilisé dans l'application Js doit être le même dans le fichier service.yaml
# Scale à 5 replicas
# kubectl scale deployment phototheque-web-deployment --replicas=5
# On fait une modif et on build la version 2.0
# docker build -t phototheque-web:2.0 .
# On met à jour le déploiement
# kubectl set image deployment/phototheque-web-deployment phototheque-web=phototheque-web:2.0

# On injecte la bonne variable de connexion pour Mongoose
# docker run -p 3003:80 -e MONGO_URI="mongodb://host.docker.internal:27017/phototheque" phototheque-web

# On crée un réseau qui va regrouper plusieurs conteneurs
# docker network create photonet
# On relance le conteneur NodeJs avec un nom particulier
# docker run -d --name node-app --network photonet phototheque-web
# On lance le conteneur nginx directement et on n'y injecte notre fichier de configuration
# docker run -d --name nginx-proxy --network photonet -p 80:80 -v ${pwd}/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine


# Supprimer les ressources allouées au namespace default
# kubectl delete all --all -n default