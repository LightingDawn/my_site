const expressSession = require('express-session');
const mongodbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongodbStore(expressSession);
  let mongoURL = "mongodb://127.0.0.1:27017";

  if (process.env.MONGODB_URL) {
    mongoURL = process.env.MONGODB_URL;
  }

  const store = new MongoDBStore({
    uri: mongoURL,
    databaseName: 'my_site',
    collection: 'sessions'
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: 'this-is-super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    Cookies: {
      maxAge: 24 * 60 * 60 * 1000
    },
    sameSite: 'lax'
  };
}

module.exports = createSessionConfig;