var db = require('../configuration/connection')
var collection = require('../configuration/collections')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');


module.exports = {

    createAdmin : async()=>{
        const adminEmail = 'admin@gmail.com'
        const adminPassword = 'admin123'
        const hashedPassword = await bcrypt.hash(adminPassword,10)
        const adminExist = await db.get().collection(collection.ADMIN_COLLECTION)
            .findOne({Email:adminEmail})
        if(!adminExist){
            await db.get().collection(collection.ADMIN_COLLECTION)
                .insertOne({
                    Email:adminEmail,
                    Password:hashedPassword
                })
                console.log('Admin Created Successfully');
             
        }else{
            console.log('Admin already exist');
            
        }
    },

    doAdminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION)
                .findOne({Email:adminData.Email})
            if(admin){
                bcrypt.compare(adminData.Password,admin.Password)
                .then((status)=>{
                    if(status){
                        console.log('Admin login Success');
                        response.admin = admin
                        response.status = true
                        resolve(response)
                        
                    }else{
                        console.log('Admin not found');
                        reject({status:false,message:'Invalid username or password'})
                    }
                })
            }else{
                console.log('Admin not found');
                resolve({status:false,message:'Admin not found'})
            }
        })
    },

    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION)
                    .aggregate([
                        {
                            $lookup:{
                                from:collection.USER_COLLECTION,
                                localField:'userId',
                                foreignField:'_id',
                                as:'user'
                            }
                        },
                        {
                             $project:{
                                totalAmount:1,
                                status:1,
                                user:{
                                    $arrayElemAt:['$user',0]
                                }
                             }
                        }
                    ]).toArray()
                    resolve(orders)
                
        })
    },

    getAllUsers:()=>{
        return new Promise(async(resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION)
                .find()
                .toArray()
                resolve(users)
        })
    },
    changeOrderStatus:(orderId,status)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION)
                .updateOne(
                    {_id:new ObjectId(orderId)},
                    {
                        $set:{status:status}
                    }
                ).then(()=>{
                    resolve();
                })
        })
    }
}