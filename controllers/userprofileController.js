const userdatas = require ('../models/userMongo')
const bcrypt = require('bcrypt')
const addressdatas = require('../models/addressMongo')
const orderdatas = require('../models/orderMongo')
const productdatas = require ('../models/productMongo')
const mongodb = require('mongodb')
    const mongoose = require('mongoose')


//  loading userprofile page for user 
const loaduserprofilePage = async (req,res)=>{
    try {
        
        const id = req.session.user
        
        const userDetails = await userdatas.findOne({_id:id})
        if(userDetails.isListed===true){
         res.render('userprofile',{userDetails})
        }
    } catch (error) {
        console.log(error.message);
    }
}


// load change password in profile page foe users
const loadchangepassword = async (req,res)=>{
        try {
             res.render('usereditpassword',{message:""})
         } catch (error) {
            console.log(error.message);
        }
}
 
// editing password conforming for users
const editPassword = async (req,res)=>{
    try {
     const password = req.body.cr_password
     const userData = await userdatas.findOne({_id:req.session.user})
     console.log(userData);
     if(userData){
        const passwordmatch = await bcrypt.compare(password,userData.Password)
        if(passwordmatch){
            const newpassword = req.body.new_password
            console.log(newpassword);
            const confirmpassword = req.body.confirm_password
            console.log(confirmpassword);
            if(newpassword===confirmpassword){
                const passwordhash = await bcrypt.hash(newpassword,10)
                console.log(passwordhash);
                await userdatas.findByIdAndUpdate(req.session.user, 
                    {Password:passwordhash
                     });
                     res.redirect('/profilepage');
            }else{
                res.render('usereditpassword',{message:"new password is not match"})
            }
        }else{
            res.render('usereditpassword',{message:"Current password is wrong !!"})

        }
     }else{
        res.render('usereditpassword',{messsage:"Unable to change the password"})

     }
      } catch (error) {
        console.log(error.message);
    }
}

 
// addmin  adress by user
const addaddress = async (req,res)=>{
    try {
        const user_id = req.session.user
        console.log(user_id);
        const addressData = {
            firstname:req.body.fname,
            lastname:req.body.lname,
            mobilenumber: req.body.number,
            pincode: req.body.pincode,
            locality: req.body.locality,
            state: req.body.state,
        }
        const findAddress = await addressdatas.findOne({ user_id: user_id });
        if (findAddress) {
            findAddress.addresses.push(addressData);
            await findAddress.save();
        } else {
            const newAddress = new addressdatas({
              user_id: user_id,
              addresses: [addressData],
            });
        
        await newAddress.save();
    }
    setTimeout(() => {
        res.redirect('/addrespage')
    }, 1000);
    } catch (error) {
        console.log(error.message);
    }
}


// loading add address for user
const loadaddresspage = async (req,res) =>{
    try {
        const id = req.session.user
        const userid = new mongoose.Types.ObjectId(id._id)
          const address = await addressdatas.findOne({user_id : userid})
                 res.render('useradress',{address})
    } catch (error) {
        console.log(error.message);   
    }
}


 
 
 
// upadte the address for user
const updateAddress = async (req, res) => {
    try {
      const addressId = req.body.address_id;
      const user = req.session.user;
         
      const filter = {
        user_id: user._id,
        'addresses._id': addressId,
      };
  
   
      const update = {
        'addresses.$.firstname': req.body.fname,
        'addresses.$.lastname': req.body.lname,
        'addresses.$.mobilenumber': req.body.mnumber,
        'addresses.$.pincode': req.body.pincode,
        'addresses.$.locality': req.body.locality,
        'addresses.$.state': req.body.state,
      };
  
      const options = { new: true };
  
      const editAddress = await addressdatas.findOneAndUpdate(filter, update, options);
   

      setTimeout(() => {
        res.redirect('/addrespage');
      }, 1000);
    } catch (error) {
      console.error('Error in updateAddress:', error.message);
      // Handle the error appropriately
    }
  };

 
// removing adderess for user
const removeAddress = async (req,res)=>{
    try {
        const id = req.query.id;
        const user = req.session.user;
   
        const addressData = await addressdatas.findOne({ user_id: user._id });
        const specificAddress = addressData.addresses.find(address => address._id.toString() === id);
        const updateResult = await addressdatas.updateOne(
            { user_id: user._id },
            { $pull: { addresses: { _id: id } } }
        );     
        res.redirect('/addrespage')

     } catch (error) {    
        console.log(error.message);
    }
}


//loading orderlist page for users
const loadorderlistpage = async (req,res)=>{
    try {
       const user_id = req.session.user
        const order = await orderdatas.find({user_id:user_id._id})
           res.render('orderlist',{order})
    } catch (error) {
        console.log(error.message);
    }   
}



 

// loading orderdetail page for user
const userorderDetailpage = async (req,res)=>{
    try {
        const id =  req.query.id
        const order = await orderdatas.findOne({_id:id})
        res.render('orderdetail',{order})
    } catch (error) {
        
    }
}


// user canceling order 
const  UsercancelOrder = async (req,res)=>{
    try {
        const order_id =req.body.orderID 
        const orders = await orderdatas.findOne({_id:order_id})
         const status = req.body.status
 
        const id = req.session.user
        if(orders.payment_type != 'Cod'){
            const wallet = await userdatas.findByIdAndUpdate({_id:id._id},{
                $inc : {Wallet : + orders.total_price}
            })
        }

        const order = await orderdatas.updateOne(
            {
                _id:order_id
            },
            {$set:{delevery_status : status}}
        )
 
        //////////////////////
         for(let i=0;i<orders.product_details.length;i++){
            await productdatas.findByIdAndUpdate(
                {_id: orders.product_details[i].product_id},
                 { $inc: {prdctstock: orders.product_details[i].quantity}},
                 { new: true }
              );        }
         /////////////////////

         res.json({status:true})
     } catch (error) {
        console.log(error.message);
    }
}

//user returning order 
const UserreturnOrder = async (req,res)=>{
    try {
        try {
            const order_id =req.body.orderID 
            const orders = await orderdatas.findOne({_id:order_id})
            console.log(orders.payment_type,'11111111111111111111111');
            const status = req.body.status
            console.log(status,'22222222222222222222222222');
    
            const id = req.session.user
                 const wallet = await userdatas.findByIdAndUpdate({_id:id._id},{
                    $inc : {Wallet : + orders.total_price}
                })
     
            const order = await orderdatas.updateOne(
                {
                    _id:order_id
                },
                {$set:{delevery_status : status}}
            )
            /////////////////////
            for(let i=0;i<orders.product_details.length;i++){
                await productdatas.findByIdAndUpdate(
                    {_id: orders.product_details[i].product_id},
                     { $inc: {prdctstock: orders.product_details[i].quantity}},
                     { new: true }
                  );        }
                  //////////////////////
            console.log(order,'333333333333333333333');
            res.json({status:true})
         } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
       console.log(error.message); 
    }
}


// userb edit address in checkoutpage 
 const userEditaddressinCheckout = async (req,res)=>{
    try {
        const addressId = req.body.address_id;
        const user = req.session.user;
           
        const filter = {
          user_id: user._id,
          'addresses._id': addressId,
        };
    
     
        const update = {
          'addresses.$.firstname': req.body.fname,
          'addresses.$.lastname': req.body.lname,
          'addresses.$.mobilenumber': req.body.mnumber,
          'addresses.$.pincode': req.body.pin,
          'addresses.$.locality': req.body.locality,
          'addresses.$.state': req.body.state,
        };
    
        const options = { new: true };
    
        const editAddress = await addressdatas.findOneAndUpdate(filter, update, options);
         res.redirect('/checkoutpage')
    } catch (error) {
        console.log(error.message);
    }
 }


 // user adding new address in checkut
 const newaddress = async (req,res)=>{
    try {
        const user_id = req.session.user
         const addressData = {
            firstname:req.body.fname,
            lastname:req.body.lname,
            mobilenumber: req.body.mnumber,
            pincode: req.body.pin,
            locality: req.body.locality,
            state: req.body.state,
        }
        const findAddress = await addressdatas.findOne({ user_id: user_id });
        if (findAddress) {
            findAddress.addresses.push(addressData);
            await findAddress.save();
        } else {
            const newAddress = new addressdatas({
              user_id: user_id,
              addresses: [addressData],
            });
        
        await newAddress.save();
    }
    setTimeout(() => {
        res.redirect('/checkoutpage')
    }, 1000);
    } catch (error) {
        console.log(error.message);
    }
}

const invoice = async (req,res)=>{
    try {
    const order_id =  req.query.orderId
    const order = await orderdatas.findOne({_id:order_id})
        res.render('invoice',{orderDetail:order})
    } catch (error) {
        console.log(error.message);
    }
}



//exporting all controllers
module.exports={
    loaduserprofilePage,
    loadaddresspage,
    loadchangepassword,
    editPassword,
    addaddress,
    loadorderlistpage,
    userorderDetailpage,
    UsercancelOrder,
    removeAddress,
    updateAddress,
    userEditaddressinCheckout,
    newaddress,
    UserreturnOrder,
    invoice
}   