### J'ai codé une photothèque dans laquelle j'ai organisé les images en albums
### Pour ce faire, j'ai développé plusieurs routes pour mon application dans ./routes/album.js

### /albums : GET
### /albums/new : GET
### /albums/new : POST
### /albums/:albumId/imgs : GET
### /albums/newImgs/:albumId/:albumTitle : GET
### /albums/editImg/:imgId : GET
### /albums/imgs/:albumId : POST
### /albums/editImg/:imgId : POST
### /albums/deleteImg/:imgId : POST
### /albums/delete/:id : POST

### Ces différentes routes permettent de servir les pages dans ./views/

### Pour ce qui est du Dockerfile:
### J'ai défini un repertoire de travail dans mon container où j'ai copié le contenu de mon répertoire courant
### local, ensuite j'ai installé les dépendances dans le repertoire du container via 'npm install' et enfin j'ai
### exposé le port 3003 et lancer l'application via 'npm start'

### Configuration des Github Actions
### Cette partie a été faite en 6 grandes étapes:
### 1- Installer les dépendances
### 2- Vérifier les permissions des fichiers Jest (Ici on vérifie que jest et ses fichiers s'éxécutent bien dans le container)
### 3- Lancer les tests
### 4- Connexion à Docker Hub via les identifiants de la session docker
### 5- Construire l'image Docker si et seulement si les tests ont été effectués avec succès
### 6- Pousser l'image Docker vers Docker Hub