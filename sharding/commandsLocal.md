# on ouvre et on garde ouvert 4 cmd distincts pour exécuter une des 4 commandes dans chaque
# config server

# mongod --configsvr --replSet configReplSet --port 26050 --dbpath C:\Users\marce\Desktop\IT-works\photothequeNodeJs\sharding\config

# Shard 1

# mongod --shardsvr --replSet shard1ReplSet --port 27018 --dbpath C:\Users\marce\Desktop\IT-works\photothequeNodeJs\sharding\shard1

# Shard 2

# mongod --shardsvr --replSet shard2ReplSet --port 27019 --dbpath C:\Users\marce\Desktop\IT-works\photothequeNodeJs\sharding\shard2

# shard 3

# mongod --shardsvr --replSet shard3ReplSet --port 27020 --dbpath C:\Users\marce\Desktop\IT-works\photothequeNodeJs\sharding\shard3

# Dans un nouveau shell, connecte-toi à chaque port pour initialiser

mongosh --port 26050

rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "localhost:26050" }]
})

rs.initiate({
  _id: "shard1ReplSet",
  members: [{ _id: 0, host: "localhost:27018" }]
})

rs.initiate({
  _id: "shard2ReplSet",
  members: [{ _id: 1, host: "localhost:27019" }]
})

rs.initiate({
  _id: "shard3ReplSet",
  members: [{ _id: 2, host: "localhost:27020" }]
})

# On démarre le routeur mongos

# mongos --configdb configReplSet/localhost:26050 --port 27017

# Ajouter les shards au cluster via un shell mongos et vérifie
mongosh --port 27017
sh.addShard("shard1ReplSet/localhost:27018")
sh.addShard("shard2ReplSet/localhost:27019")
sh.addShard("shard3ReplSet/localhost:27020")
sh.status()

# Activer le sharding sur ma base de données photothèque

use phototheque
sh.enableSharding("phototheque")
sh.shardCollection("phototheque.images", { _id: "hashed" })


