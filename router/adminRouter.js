const express = require('express')
const path = require("path")
const admin_router = express();
const multer = require ('multer')

const productStorage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'./public/admin_assets/uploads')
    },
  
    //extention
    filename: (req,file,callback)=>{
        callback(null,Date.now()+file.originalname)
    }
  })
  
  //upload parameters for multer
  const uploadPrdt = multer({
    storage: productStorage,
    limits:{
        fieldSize: 1024*1024*5
    }
  })

const adminController = require('../controllers/adminController')
const adminuserController = require('../controllers/adminusercontroller')
const adminauth  = require('../middlewares/admin-auth')
const categorycontroller = require('../controllers/categoryController')
const productContrller = require('../controllers/productController')
const adminOrderController = require('../controllers/adminOrderController')
const adminBannerController = require('../controllers/adminBannerController')
const adminCouponController = require('../controllers/adminCouponController')

admin_router.use(express.static('public'))
const bodyParser = require('body-parser');
admin_router.set('view engine','ejs')
admin_router.set('views','./views/admin')
admin_router.use(bodyParser.json())
admin_router.use(bodyParser.urlencoded({extends:true}))

// admincontroller
admin_router.get('/',adminauth.adminislogout,adminController.loadadminlogin)//getting adminlogin  page
admin_router.get('/adminhome',adminauth.adminislogin,adminController.loadadminhome)// getting adminhome page
admin_router.post('/verifyadmindata',adminController.verifyadmindata) // clicking login by admin
admin_router.get('/logout',adminController.adminlogout)//clicking logout by admin


// admin usercontroller
admin_router.get('/adminhome/userslist',adminauth.adminislogin,adminuserController.loaduserslist)// load userslist
admin_router.get('/adminhome/userunlisted',adminauth.adminislogin,adminuserController.userunlist)
admin_router.get('/adminhome/userlisted',adminauth.adminislogin,adminuserController.userlist)
 
//admin categorycontroller
admin_router.get('/adminhome/categorylist',adminauth.adminislogin,categorycontroller.loadcategorylist)
admin_router.get('/adminhome/addcategories',adminauth.adminislogin,categorycontroller.loadcategory)
admin_router.post('/adminhome/categoryadd',adminauth.adminislogin,uploadPrdt.single('image'),categorycontroller.addcategory)
admin_router.get('/adminhome/editcategory',adminauth.adminislogin,categorycontroller.loadEditCategory)
admin_router.post('/adminhome/categoryedit',adminauth.adminislogin,uploadPrdt.single('image'),categorycontroller.editctegory)
admin_router.get('/adminhome/categoryunlisted',adminauth.adminislogin,categorycontroller.categoryunlisted)
admin_router.get('/adminhome/categorylisted',adminauth.adminislogin,categorycontroller.categorylisted)

//admin propductcontroller
admin_router.get('/adminhome/productlist',adminauth.adminislogin,productContrller.loadproductlist)
admin_router.get('/adminhome/addproduct',adminauth.adminislogin,productContrller.loadaddproductpage)
admin_router.post('/adminhome/productadd',adminauth.adminislogin,uploadPrdt.array('image'),productContrller.addproduct)
admin_router.get('/adminhome/editproduct',adminauth.adminislogin,productContrller.loadeditproduct)
admin_router.post('/adminhome/productedit',adminauth.adminislogin,uploadPrdt.array('image'),productContrller.editproduct)
admin_router.get('/adminhome/productunlisted',adminauth.adminislogin,productContrller.unlistproduct)
admin_router.get('/adminhome/productlisted',adminauth.adminislogin,productContrller.listproduct)
admin_router.get('/adminhome/deleteimg',adminauth.adminislogin,productContrller.deleteimage)


//admin order Controller
admin_router.get('/adminhome/orders',adminauth.adminislogin,adminOrderController.loadOrderpage)
admin_router.get('/adminhome/orderdetail',adminauth.adminislogin,adminOrderController.loaddetailpage)
admin_router.post('/adminhome/selected-status',adminauth.adminislogin,adminOrderController.adminchanginStatus)
admin_router.get('/adminhome/salesreport',adminauth.adminislogin,adminOrderController.salesriport)
admin_router.get('/adminhome/sales-report',adminauth.adminislogin,adminOrderController.salesReport)


// admin Banner  Controller
admin_router.get('/adminhome/bannerpage',adminauth.adminislogin,adminBannerController.loadAddBannerpage)
admin_router.post('/adminhome/addbanner',adminauth.adminislogin,uploadPrdt.single('banner_Logo'),adminBannerController.addBanner) 
admin_router.get('/adminhome/bannerlist',adminauth.adminislogin,adminBannerController.loadBannerList)
admin_router.get('/adminhome/editbanner',adminauth.adminislogin,adminBannerController.loadEditBannerPage)
admin_router.post('/adminhome/updatebanner',adminauth.adminislogin,uploadPrdt.single('banner_Logo'),adminBannerController.updateBanner)
admin_router.get('/adminhome/deletebanner',adminauth.adminislogin,adminBannerController.deleteBanner)

// admin coupon controller
admin_router.get('/adminhome/addcoupon',adminauth.adminislogin,adminCouponController.loadAddCouponPage)
admin_router.post('/adminhome/couponadd',adminauth.adminislogin,adminCouponController.addCoupon)
admin_router.get('/adminhome/couponlist',adminauth.adminislogin,adminCouponController.couponList)
admin_router.get('/adminhome/deletecoupon',adminauth.adminislogin,adminCouponController.deleteCoupon)
    

module.exports = admin_router