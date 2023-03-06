const expressSession = require('express-session');
const mongodbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongodbStore(expressSession);

  const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
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