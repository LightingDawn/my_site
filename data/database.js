const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let mongoURL = "mongodb://127.0.0.1:27017";

if (process.env.MONGODB_URL) {
  mongoURL = process.env.MONGODB_URL;
}

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(mongoURL);

  database = client.db("my_site");
}

function getDb() {
  if (!database) {
    throw new Error("你必須先連上資料庫");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
