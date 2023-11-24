const express = require('express')
const user_router = express();
const path = require('path')

const userController = require('../controllers/userController');
const usercartController = require('../controllers/usercartcontroll')
const bodyParser = require('body-parser');
const userauth = require('../middlewares/user-auth')
const userprofileController = require('../controllers/userprofileController')
 
user_router.set('view engine','ejs')
user_router.set('views','./views/users')
user_router.use(bodyParser.json())
user_router.use(bodyParser.urlencoded({extends:true}))  

user_router.use(express.static('public'))

user_router.get('/signup',userauth.islogout,userController.loadSignup)
user_router.post('/verifyvalidation',userController.verifyValidation)
user_router.post('/verifyOtp',userController.verifyOtp)

user_router.get('/',userController.loadhomepage)
user_router.get('/login',userController.loadLogin)
user_router.post('/homepage',userController.verifylogin)
user_router.get('/homepage',userauth.islogin,userController.loadhomepage)
user_router.get('/logout',userauth.islogin,userController.userlogout)
user_router.get('/confirmemail',userauth.islogout,userController.loadconfirmemail)
user_router.post('/verifyuser',userController.confirmuser) 
user_router.post('/forg-verifyOtp',userController.forgottverifyOtp)
user_router.get('/changepassword',userController.changePassword)
user_router.post('/passwordReset',userController.newpassword)
user_router.get('/resendotp',userController.ResendOtpverifyValidation)   
     

//userproduct controller
user_router.get('/shop',userController.loadshoppage)
user_router.get('/details',userController.loaddetailpage)
user_router.get('/categoryitems',userController.clickcategory)
user_router.post('/searcheditems',userController.searchProducts)
user_router.get('/sortedlowtohigh',userController.sortproductsAssending)
user_router.get('/sortedhightolow',userController.sortproductsDessending)
user_router.get('/homedetails',userController.loaddetailpagefromhome)    
 

// usercartControll
user_router.get('/cartpage',userauth.islogin, usercartController.loadcart) 
user_router.get('/addtocart',userauth.islogin,usercartController.addtocart)
user_router.get('/deletecartItem',userauth.islogin,usercartController.deleteCartItem)
user_router.get('/checkoutpage',userauth.islogin,usercartController.loadcheckoutPage)
user_router.post('/placeorder',userauth.islogin,usercartController.placeorder)  
user_router.post('/changeQuantity',userauth.islogin,usercartController.changeQuantity)
user_router.post('/applycoupon',userauth.islogin,usercartController.applyCoupon)



//  userProfileControll  
user_router.get('/profilepage',userauth.islogin,userprofileController.loaduserprofilePage)
user_router.get('/addrespage',userauth.islogin,userprofileController.loadaddresspage)
user_router.get('/updatepassword',userauth.islogin,userprofileController.loadchangepassword)
user_router.post('/changedpassword',userprofileController.editPassword)
user_router.post('/addedaddress',userprofileController.addaddress)
user_router.post('/verify-payment' ,usercartController.verifyPayment)
user_router.get('/removeadress',userprofileController.removeAddress)
user_router.post('/updatedAddress',userprofileController.updateAddress)
user_router.get('/thankyou',usercartController.thankyou)
user_router.post('/addresschange',userauth.islogin,userprofileController.userEditaddressinCheckout)
user_router.post('/newaddress',userauth.islogin,userprofileController.newaddress)
user_router.get('/invoice',userprofileController.invoice)


 


//user ordercontroller
user_router.get('/orderlist',userprofileController.loadorderlistpage)
user_router.get('/userorderdetail',userprofileController.userorderDetailpage)
user_router.post('/cancelorder',userprofileController.UsercancelOrder)
user_router.post('/Returnorder',userprofileController.UserreturnOrder)

//user wallet 
user_router.get('/walletpage',userauth.islogin,userController.userWalletpage)


module.exports= user_router