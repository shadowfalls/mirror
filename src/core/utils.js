const { MongoClient } = require('mongodb');
const { connectionUrl, dbName } = require('./constants');

let client;
/**
 * It is fine to keep a single connection alive and not create multiple connections, or a
 * fresh connection each time
 *
 * https://stackoverflow.com/questions/14495975/why-is-it-recommended-not-to-close-a-mongodb-connection-anywhere-in-node-js-code
 */
exports.getConnection = async () => {
  if (!client) {
    const connection = new MongoClient(connectionUrl, {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    client = await connection.connect();
    client = client.db(dbName);
  }
  return client;
};
