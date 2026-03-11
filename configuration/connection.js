
const { MongoClient } = require('mongodb');

const state = { db: null };

module.exports.connect =  (done) => {
  const url = process.env.MONGO_URL;
   const dbname = 'shopping';

    /*mongoClient.connect(url,(err,data)=>{
        if(err)
            return done(err);
        state.db = data.db(dbname)
        console.log('Db connected');
        done();
    })*/

    mongoClient.connect(url)
    .then((data)=>{
        state.db=data.db(dbname)
        console.log('Db connected successfully')
        done()
    })
    .catch((err)=>{
        console.error('Db connection failed')
        done(err)
    })
    
}

module.exports.get = function(){
     if(!state.db){
        console.error('Db not available')
        return null
    }
    return state.db
}
