const userdatas = require('../models/userMongo');
const productdatas = require('../models/productMongo');
const categorydatas = require('../models/categoryMongo');
const cartdatas  = require('../models/cartmongo');
const bannerdatas = require('../models/bannerModel')
const bcrypt = require('bcrypt');
const { password } = require('../config/config');
const { default: mongoose } = require('mongoose');



// const accountSid = "AC1c4ac7475f14f876af95e4003720ef29";
// const authToken = "26d03fafd9f9c070ad7eb623232737c6"
// const verifySid = "VA74e5858454f81164087e56d3b62fc9dc";
// const client = require("twilio")(accountSid, authToken);




const accountSid = "AC5523bdf0744cb6957bbeb41640bc9d10";
const authToken = "e9ae550b3ede0a1046035cb2f29c8f80";
const verifySid = "VA1201188a5b9cbda2e261883ca8efd120";
const client = require("twilio")(accountSid,authToken);

// loadsignup page for user
const loadSignup = (req,res)=>{
     try {
        res.render('usersignup')
    } catch (error) {
        console.log(error.message);
    }
}


// verifying user in login
const verifyValidation = async(req,res)=>{
    
    const email =req.body.email
    const mobilenumber = req.body.mobilenumber
    req.session.mobile = mobilenumber

    const check = await userdatas.findOne({email:req.body.email})
    if(check){
        return res.render('userlogin',{msg:"user already exist!.. please login"})
    }

    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+91${mobilenumber}`, channel: "sms", })
    .then((verification) => {
        console.log(verification.status)
        req.session.userData = req.body;

        res.render('verifyOtp')
    })
    .catch((error) => {
        console.log(error.message)
    })
}

// verifying resend otp for user 
const ResendOtpverifyValidation = async(req,res)=>{
    
     const mobilenumber = req.session.mobile



    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+91${mobilenumber}`, channel: "sms", })
    .then((verification) => {
        console.log(verification.status)
 
        res.render('verifyOtp')
    })
    .catch((error) => {
        console.log(error.message)
    })
}


// securing password
const securePassword = async (password)=>{
    try {
    const   securepassword = await bcrypt.hash(password,10)
    return securepassword
    } catch (error) {
        console.log(error.message);
    }
}


// verifying user OTP
const verifyOtp = async (req, res) => {
    let {otp}  = req.body;
     otp=otp.join('')
   
    try {
        const userData = req.session.userData;

        if (!userData) {
            res.render('verifyOtp', { msg: 'Invalid Session' });
        } else {
            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: `+91${userData.mobilenumber}`, code: otp })
                .then(async (verification_check) => { // Mark the callback function as async
                    console.log(verification_check.status);
                    if(verification_check.status==='approved'){
                        const spassword = await securePassword(userData.password)
                    const user = new userdatas({
                        Username:userData.username,
                        Email:userData.email,
                        Mobilenumber:userData.mobilenumber,
                        Password:spassword ,
                        isListed:1, 
                        Wallet :0
                    })
                    try {
                        const userDataSave = await user.save();
                        if (userDataSave) {
                             res.redirect('/login');
                        } else {
                            res.render('userlogin', { msg: "Registration Failed" });
                        }
                    } catch (error) {
                        console.log(error.message);
                        res.render('userlogin', { msg: "Registration Failed" });
                    }
                  }else{
                    res.render('verifyOtp',{msg:"invalid otp"})
                  }
                }).catch((error) => {
                    console.log(error.message);
                });
        }
    } catch (error) {
        console.log(error.message);
    }
};

// loading loginpage for user
const loadLogin = async (req,res) =>{
    try {
        if(req.session.user){
            res.redirect('/homepage')
        }else{
            
            res.render('userlogin',{msg:""})
        }
    } catch (error) {
        console.log(error.message);
    }
}

 
// verifying the user
// const verifylogin = async (req,res) =>{
//     try {
//         if(req.session.user){
//             res.redirect('/homepage')
//          }
//         const useremail = req.body.email
//         const userpassword = req.body.password
        
//          const userdetails = await userdatas.findOne({Email:useremail})

//         if(userdetails){
//              const passwordMatch = await bcrypt.compare(userpassword,userdetails.Password)
//             if(userdetails.isListed===true){
//             if( passwordMatch){
//                 req.session.user = userdetails
//                 res.redirect('/homepage')
//             }else{
//                 // invalid password
                
//                 res.render('userlogin')
//                 console.log('password is incorrect');
//             }
//         }else{
//             // invalid emaill
//             res.render('userlogin')
//             console.log("Invalid Email id");
//         }
//     }
//     else{
//         res.render('userlogin')
//     }
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const verifylogin = async (req,res) =>{
    try {
        if(req.session.user){
            res.redirect('/homepage')
         }
        const useremail = req.body.email
        const userpassword = req.body.password
        
         const userdetails = await userdatas.findOne({Email:useremail})

        if(userdetails){
             const passwordMatch = await bcrypt.compare(userpassword,userdetails.Password)
            if(userdetails.isListed===true){
            if( passwordMatch){
                req.session.user = userdetails
                res.redirect('/homepage')
            }else{
                // invalid password
                
                res.render('userlogin',{msg:"password is incorrect"})  
             }
        }else{
            // if blocked 
            res.render('userlogin',{msg:"You are Blocked"})
         }
    }
    else{
         // invalid emaill
         res.render('userlogin', {msg:"E Mail is Incorrect"})
    }
    } catch (error) {
        console.log(error.message);
    }
}



 



//logout for user
const userlogout = async (req,res) =>{
  try {
    if(req.session.user){
        req.session.destroy()
        res.redirect('/login')
    }
  } catch (error) {
    console.log(error.message); 
  }
}

 
// homepage loading for user    
const loadhomepage =  async (req,res)=>{
    try {
        const categoryData = await categorydatas.find({})
        const  product      = await productdatas.find({}).limit(4)
        const banner        = await bannerdatas.find({})
             res.render('index',{categoryData,product,banner})
        
    } catch (error) {
        console.log(error.message);
    }
}   


//shoppage loading for user
const loadshoppage = async (req,res)=>{
    try {
      const productData = await productdatas.find({})
       
         res.render('shop',{productData})
         
    } catch (error) {
        console.log(error.message);
    }
}


// loading product detail page for user
const loaddetailpage = async (req, res) => {
    try {   
        const id = new mongoose.Types.ObjectId(req.query.id);
        const user = req.session.user
        const userid = new mongoose.Types.ObjectId(user._id)
         console.log(userid);
        const productData = await productdatas.findOne({ _id: id });

        const cproduct = await cartdatas.aggregate([
            {
                $match: { 
                    user_id: userid }
            },
            {
                $unwind: '$cart_items'
            },
            {
                $match: {
                    'cart_items.product_id': id
                }
            }
        ]);

       

        res.render('detail', { productData ,cproduct});
    } catch (error) {
        console.log(error.message);
    }
};


// load product detail page for user from homepage
const loaddetailpagefromhome = async (req,res)=>{
    try {
        const id = new mongoose.Types.ObjectId(req.query.id);
        const productData = await productdatas.findOne({_id : id})
        const user = req.session.user
        const userid = new mongoose.Types.ObjectId(user._id)
        const cproduct = await cartdatas.aggregate([
            {
                $match: { 
                    user_id: userid }
            },
            {
                $unwind: '$cart_items'
            },
            {
                $match: {
                    'cart_items.product_id': id
                }
            }
        ]);

         res.render('detail',{productData,cproduct})
    } catch (error) {
        console.log(error.message);
    }
}


// loading mnumber confirmation for user
const loadconfirmemail = async (req,res)=>{
    try {
        res.render('confirmemail')
 
    } catch (error) {
        console.log(error.message);                     
    }
}



// conforming user for password change
 const confirmuser = async (req,res) =>{ 
    try{
     const mobilenumber = req.body.mobilenumber
     const check = await userdatas.findOne({Mobilenumber:mobilenumber})
     
  
   if(check){
    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+91${mobilenumber}`, channel: "sms", })
    .then((verification) => {
        console.log(verification.status)
        req.session.userData = req.body;

        res.render('forg-verifyotp')
    }) 
}else{
    console.log('hello');
  res.render('userlogin',{message:"mobile number not registered"})
}
}catch(error)  {
        console.log(error.message)
    }
}

// password changing page loading for user
const changePassword = async (req,res)=>{
    try {
        res.render('changepassword')
    } catch (error) {
        console.log(error.message);
    }
}


// forgaott password otp varification for user
const forgottverifyOtp = (req,res)=>{
    let {otp}  = req.body;    
    otp=otp.join('')
  
   try {
       const userData = req.session.userData;

       if (!userData) {
           res.render('verifyOtp', { msg: 'Invalid Session' }); 
       } else {              
        console.log('hello1111');
           client.verify.v2
               .services(verifySid)
               .verificationChecks.create({ to: `+91${userData.mobilenumber}`, code: otp })
               .then(async (verification_check) => { // Mark the callback function as async
                   console.log(verification_check.status);
                   if(verification_check.status==='approved'){
                    res.redirect('/changepassword')
                   }         
                   else{
                    res.render('verifyOtp',{msg:"invalid otp"})
                   }
               }).catch((error)=>{
                console.log(error.messsage);
               })      
            }
    } catch (error) {
        console.log(error.message);
    } 
}

 



 //new password setting for user
const newpassword = async (req, res) => {
    try {
        const password = req.body.newpassword;
        const confirm_password = req.body.confirm_password;
        const userData = req.session.userData ; // or mobile number, depending on what you stored
         const mobile = userData.mobilenumber
  

        if (password === confirm_password) {
            const user = await userdatas.findOne({Mobilenumber: mobile});
            
            if (user) {
                const spassword = await securePassword(password)

                const set = await userdatas.updateOne({Mobilenumber : mobile},{
                    $set : { Password : spassword}
                })
              
                res.redirect('/login'); // Redirect to the login page or wherever you prefer
            } else {
                res.render('newpassword', { msg: 'User not found' });
            }
        } else {
            res.render('newpassword', { msg: 'Passwords do not match' });
        }
    } catch (error) {
        console.log(error.message);
    }
}


 
 // click category to show the category items for user
 const clickcategory = async (req,res)=>{
    try {
        const id = req.query.id
        
        const categoryData = await categorydatas.find({})
        const  product      = await productdatas.find({prdctcategory:id})
        const banner        = await bannerdatas.find({})

        res.render('index',{categoryData,product,banner})
         } catch (error) {
        console.log(error.message);
    }
}


// search product for user
//  const searchProducts = async (req,res)=>{
//     try {
//         const search = req.body.search
//         const productData = await productdatas.find({"prdctname":{ $regex:".*"+search+"*.",$options:'i' } })
//         if(productData.length>0){
//            res.render('shop',{productData})
//         }else{
//           res.render('shop')
//         }

//     } catch (error) {
//         console.log(error.message);
//     }
//  }
const searchProducts = async (req, res) => {
    try {
        const search = req.body.search;
        const productData = await productdatas.find({"prdctname": { $regex: ".*" + search + ".*", $options: 'i' } });
        
        if (productData.length > 0) {
            res.render('shop', { productData }); // Rendering when there's search data
        } else {
            res.render('shop', { productData: [] }); // Passing an empty array when no search data found
        }
    } catch (error) {
        console.log(error.message);
    }
};



 //sorting product assending prices for users
 const sortproductsAssending =  async(req,res)=>{
    try {
        const sortQuery = {prdctprice: 1}
        const productData = await productdatas.find({}).sort(sortQuery)
        res.render('shop',{productData})
    } catch (error) {
        console.log(error.message);
    }
 }

// sorting product dessending prices for users
 const sortproductsDessending = async(req,res)=>{
try {
    const sortQuery = {prdctprice: -1}
    const productData = await productdatas.find({}).sort(sortQuery)    
    res.render('shop',{productData})
} catch (error) {
    console.log(error.message);
}
 }


 const userWalletpage = async (req,res)=>{
    try {
        const user = req.session.user
        const wallet = await userdatas.findOne({_id:user._id})
        console.log(wallet);
        res.render('userwallet',{wallet})
    } catch (error) {
        console.log(error.message);
    }
 }
 

 
 



 
// exporting all controllers
module.exports={
 loadSignup,
 loadLogin,
 loadhomepage,
 verifylogin,
 userlogout,
 verifyValidation, 
 verifyOtp,
 loadshoppage,
 loaddetailpage,
 loadconfirmemail, 
 confirmuser,
  clickcategory,
 searchProducts,
 sortproductsAssending,
 sortproductsDessending,
 loaddetailpagefromhome,
 changePassword,
 forgottverifyOtp ,
 newpassword,
 ResendOtpverifyValidation,
 userWalletpage
 }