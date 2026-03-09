var db = require('../configuration/connection')
var collection = require('../configuration/collections');
var objectId = require('mongodb').ObjectId;
module.exports = {

    addProduct:(product,callback)=>{
        console.log(product);
        const database = db.get();
        console.log('Database values : ',database);
        
        database.collection('product').insertOne(product).then((data)=>{
            //console.log(data);
            
            callback(data.insertedId);
        })
    },

    getAllProducts:(callback)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(collection.PRODUCT_COLLECTION);
            
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products)
        })
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new objectId(proId)})
                .then((response)=>{
                    console.log(response);
                    resolve(response)
                })
        })
    },

    getProductDetails:(proId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)})
                .then((product)=>{
                    resolve(product);
                })
        })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},
                {
                    $set:{
                        Name:proDetails.Name,
                        Category:proDetails.Category,
                        Price:proDetails.Price,
                        Description:proDetails.Description,

                    }
                }).then((response)=>{
                    resolve()
                })
        })
    }
}