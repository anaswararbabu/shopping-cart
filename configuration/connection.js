const { MongoClient } = require('mongodb');

const state = { db: null };

module.exports.connect = async (done) => {
    const url = process.env.MONGO_URL;
    const dbname = 'shoppingCart';

    if (!url) {
        console.error("MongoDB URL not defined!");
        return done(new Error("MongoDB URL not defined!"));
    }

    try {
        const client = await MongoClient.connect(url); // v5+ no options needed
        state.db = client.db(dbname);
        console.log('Db connected successfully');
        done();
    } catch (err) {
        console.error('Db connection failed', err);
        done(err);
    }
};

module.exports.get = function () {
    if (!state.db) {
        console.error('Db not available');
        return null;
    }
    return state.db;
}
