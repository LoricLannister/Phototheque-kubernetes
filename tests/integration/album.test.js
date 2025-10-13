// tests/integration/albums.test.js
const mongoose = require('mongoose');
const express = require('express');
const supertest = require('supertest');
const router = require('../../routes/album');
const Album = require('../../models/Album');

let app;
let request;

beforeAll(async () => {
  // Connexion à la base de test (phototheque_test)
  const uri = process.env.MONGO_TEST_URI || "mongodb://localhost:27017/phototheque_test";

  console.log("🔗 Connecting to test database:", uri);
  await mongoose.connect(uri)
    .then(() => console.log("✅ Connexion réussie à la base de test"))
    .catch(err => {
      console.error("❌ Erreur de connexion à la base de données de test :", err);
      process.exit(1);
    });

  // Création d'une instance express
  app = express();
  app.set("view engine", "ejs");
  app.use(express.json());
  app.use('/albums', router);

  request = supertest(app);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /albums', () => {
  it('✅ doit renvoyer les albums présents dans phototheque_test', async () => {
    const albumsCount = await Album.countDocuments();
    console.log(`➡️ Albums trouvés dans la base de test : ${albumsCount}`);

    expect(albumsCount).toBeGreaterThan(0);

    const response = await request.get('/albums');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');

    // Vérifie que les titres d’albums connus apparaissent
    const sampleAlbum = await Album.findOne();
    if (sampleAlbum) {
      expect(response.text).toContain(sampleAlbum.title);
    }
  });

  it('⚠️ doit gérer les erreurs de la base de données proprement', async () => {
    // Simule une erreur volontairement
    jest.spyOn(Album, 'find').mockImplementationOnce(() => {
      throw new Error('Erreur Mongo simulée');
    });

    const response = await request.get('/albums');
    expect(response.status).toBe(500);
  });
});
