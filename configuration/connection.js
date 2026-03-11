[1:09 pm, 11/03/2026] Anaswara: const mongoClient = require('mongodb').MongoClient;
const state = { db: null };

module.exports.connect = (done) => {
    const url = process.env.MONGO_URL; // <-- use env variable
    if (!url) return done(new Error("MongoDB URL not defined!"));

    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((client) => {
            state.db = client.db();
            console.log("Db connected successfully");
            done();
        })
        .catch((err) => {
            console.error("Db connection failed", err);
            done(err);
        });
};

module.exports.get = () => {
    if (!state.db) {
        console.error("Db not available");
        return null;
    }
    return state.db;
};
[1:10 pm, 11/03/2026] Anaswara: // configuration/connection.js
const mongoClient = require('mongodb').MongoClient;
const state = { db: null };

module.exports.connect = (done) => {
    const url = process.env.MONGO_URL; // <-- use env variable
    if (!url) return done(new Error("MongoDB URL not defined!"));

    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((client) => {
            state.db = client.db();
            console.log("Db connected successfully");
            done();
        })
        .catch((err) => {
            console.error("Db connection failed", err);
            done(err);
        });
};

module.exports.get = () => {
    if (!state.db) {
        console.error("Db not available");
        return null;
    }
    return state.db;
};
