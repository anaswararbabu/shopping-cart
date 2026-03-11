
const { MongoClient } = require('mongodb');

const state = { db: null };

module.exports.connect = async (done) => {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error("MongoDB URL not defined!");
    return done(new Error("MongoDB URL not defined!"));
  }

  try {
    const client = await MongoClient.connect(url); // <--- no options
    state.db = client.db(); // default DB from URL
    console.log("Database connected successfully");
    done();
  } catch (err) {
    console.error("Db connection failed", err);
    done(err);
  }
};

module.exports.get = () => state.db;
