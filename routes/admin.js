var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var adminHelpers = require('../helpers/admin-helpers')
const cloudinary = require('../configuration/cloudinary')
/* GET users listing. */

const verifyAdminLogin = (req,res,next)=>{
  console.log('Admin Session',req.session.admin);
  console.log('Admin loggedIn',req.session.adminLoggedIn);
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/login');
  }
}

router.get('/',verifyAdminLogin,(req,res)=>{
  res.redirect('/admin/view-products')
})

router.get('/login',(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin/view-products');
  }else{
  res.render('admin/login',{admin:true,loginErr:req.session.adminLoginErr});
  req.session.adminLoginErr = false
  }
})

router.post('/login',(req,res)=>{
  adminHelpers.doAdminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin/view-products')
    }else{
      req.session.adminLoginErr = 'Invalid username or Password'
      res.redirect('/admin/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log('Error destroying session',err);
      
    }
    res.redirect('/admin/login')
  })
})

router.get('/view-products',verifyAdminLogin, function(req, res, next) {
 
 productHelpers.getAllProducts().then((products)=>{
 // console.log(products);
  res.render('admin/view-products',{admin:true,products,activeProducts:true})
 })
});

router.get("/add-product",verifyAdminLogin,function(req,res){
  res.render('admin/add-product',{admin:true})
});

router.post('/add-product', verifyAdminLogin, async (req, res) => {

  try {

    if (!req.files || !req.files.Image) {
      return res.send("Image not uploaded");
    }

    let image = req.files.Image;

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "products"
    });

    req.body.image = result.secure_url;

    productHelpers.addProduct(req.body, (id) => {
      res.redirect('/admin/view-products');
    });

  } catch (err) {
    console.error("Add product error:", err);
    res.send("Product upload failed");
  }

});

router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/view-products')
  })
})

router.get('/edit-product/:id',verifyAdminLogin,async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product,admin:true})
})

router.post('/edit-product/:id',verifyAdminLogin,(req,res)=>{
 // console.log(req.params.id);
  let id = req.params.id
  productHelpers.updateProduct(id,req.body).then(()=>{
    
    if(req.files && req.files.Image){
      let image = req.files.Image
      image.mv('./public/images/product-images/'+id+'.jpeg')
    }
    res.redirect('/admin/view-products')
  })
})

router.get('/all-orders',verifyAdminLogin,async(req,res)=>{
  const orders = await adminHelpers.getAllOrders()

  res.render('admin/all-orders',{orders,admin:true,activeOrders:true})
})

router.get('/all-users',verifyAdminLogin,async(req,res)=>{
  const users = await adminHelpers.getAllUsers()
  res.render('admin/all-users',{users,admin:true,activeUsers:true})
})

router.post('/change-order-status',(req,res)=>{
  adminHelpers.changeOrderStatus(req.body.orderId,req.body.status)
  res.json({status:true})
})
module.exports = router;
