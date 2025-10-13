/**
 * Clone part of the MongoDB production database into a test database.
 * Run with: node scripts/clone-db.js
 */
const mongoose = require('mongoose');

const PROD_URI = secrets.MONGO_URI || 'mongodb://localhost:27017/phototheque';
const TEST_URI = secrets.MONGO_TEST_URI || 'mongodb://localhost:27017/phototheque_test';

// Liste des collections à copier (à adapter selon ton modèle)
const collectionsToClone = ['albums', 'users', 'images']; 

async function cloneDatabase() {
  console.log('🔄 Starting database cloning...');
  console.log('production uri:' + PROD_URI);
  console.log('test uri:' + TEST_URI);
  const prodConn = await mongoose.createConnection(PROD_URI).asPromise();
  const testConn = await mongoose.createConnection(TEST_URI).asPromise();

  for (const collName of collectionsToClone) {
    const source = prodConn.collection(collName);
    const target = testConn.collection(collName);

    console.log(`📦 Cloning collection: ${collName}`);

    // Supprimer les anciennes données de test
    await target.deleteMany({});

    // Récupérer un échantillon de la prod (par exemple, 100 documents max)
    const docs = await source.find({}).limit(100).toArray();

    if (docs.length) {
      await target.insertMany(docs);
      console.log(`✅ Copied ${docs.length} documents from ${collName}`);
    } else {
      console.log(`⚠️ No data found in ${collName}`);
    }
  }

  await prodConn.close();
  await testConn.close();
  console.log('🎉 Clone complete: phototheque → phototheque_test');
}

cloneDatabase().catch((err) => {
  console.error('❌ Error during clone:', err);
  process.exit(1);
});
