const userdatas = require('../models/userMongo');
const productdatas = require('../models/productMongo');
const categorydatas = require('../models/categoryMongo');
const cartdatas = require('../models/cartmongo');
const { default: mongoose } = require('mongoose');
const addressdatas = require('../models/addressMongo');
const orderdatas = require('../models/orderMongo');
const Razorpay = require('razorpay')
const coupondatas = require('../models/couponMongo')

var instance = new Razorpay({
    key_id: 'rzp_test_rq3snpUgN7rtBl',
    key_secret: '1zobkxWvTdKnldvuepL11wm2',
});

// loading cart page for user
const loadcart = async (req,res) => {
    try {
      const cart = await cartdatas.find({user_id:req.session.user})
      if( typeof(cart[0]) == "undefined") {
         res.render('cart', { cart:null})
        
      }else{
         let productdetails = []
         const cartItem = await cartdatas.find({user_id:req.session.user})
          for (let i = 0; i < cartItem[0].cart_items.length; i++) {
          productdetails.push(await productdatas.findById(cartItem[0].cart_items[i].product_id))
         }
         res.render('cart', { cart:cartItem,productdetails})
        }
    } catch (error) {
       console.log(error.message);   
    }
}


// addto cart for user
const addtocart = async(req,res)=>{
    try {
      console.log("hiii");
      const id = new mongoose.Types.ObjectId(req.query.id);
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

    const user_id = req.session.user
    const product_id = req.query.id
    const productData =  await productdatas.findOne({_id:product_id})
    const product = await productdatas.findOne({_id:product_id})      
        const cart_items = {
        product_id:product_id,
        product_name:product.prdctname,
        product_price:product.prdctprice,
        quantity: 1,
        product_image: product.prdctimage[0]
     }
     const findcart = await cartdatas.findOne({user_id:user_id})
    if(findcart){
        const existItem = await findcart.cart_items.find((item)=>{
            return item.product_id.toString()===product_id.toString()
        })
        if(existItem){
            existItem.quantity +=1 
            existItem.prdctprice =  existItem.prdctprice*existItem.quantity
            findcart.save()
        }else{
            findcart.cart_items.push(cart_items)
            await findcart.save()
        }
    }else{
        const newItem = new cartdatas ({
            user_id : user_id,
            cart_items : []
        })
        newItem.cart_items.push(cart_items)
        await newItem.save()
     } 
  setTimeout(() => {
    res.redirect('/details?id=' + product_id);

  }, 1500);


    


      } catch (error) {
        console.log(error.message);         
    }
} 




 
 

 // change quantity for user
const changeQuantity = async (req, res) => {
    try {
         let { count1, totalproduct, carttotal, product_id } = req.body;
        const product = await productdatas.findOne({_id:product_id})
         const quantity = product.prdctstock
        const user = req.session.user; // Assuming you have the user in the session
      // console.log(count1,"yyyyyyyyyyyyyyyyyyyyyyyyyy")
       let data = await cartdatas.updateOne(
            {  
              user_id:user._id,
              'cart_items.product_id': product_id
            },
            {
              $inc: {
                'cart_items.$.quantity': count1, 
              }
            },
            {
                new:true    
            }
        )
         // Find the user's cart and the specific cart item by product_id
        const cart = await cartdatas.findOne({ user_id: user._id });
        const cartItem = cart.cart_items.find(item => item.product_id.toString() === product_id);

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Update the quantity and other fields for the specific cart item
        cartItem.quantity = count1;
 
        await cart.save();
       res.send({quantity})               
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// delete cart product for user
const deleteCartItem  = async (req,res)=>{
      try {
        const  user_id = req.session.user
        const product_id = req.query.id
       const upadateProduct = await cartdatas.findOneAndUpdate(
        {user_id: user_id},
        {$pull: { cart_items: {product_id:product_id} } },
        {new:true}  
       );
        

       res.redirect('/cartpage')

      } catch (error) {
        console.log(error.message);
      }
}


//loading checkout page for user
const loadcheckoutPage = async (req,res)=>{
         
    try {
        const id = req.session.user
         const userid = new mongoose.Types.ObjectId(id._id)
        const address = await addressdatas.findOne({user_id : userid})
        const cartItem = await cartdatas.find({user_id:id})
         let total = 0
        for (let i = 0; i < cartItem[0].cart_items.length; i++) {
          total += cartItem[0].cart_items[i].product_price * cartItem[0].cart_items[i].quantity
        }
         total= total + 500
        req.session.total = total
        let status = req.session.coupon = false
          res.render('checkout',{address,cart:cartItem,total,status}) 
 
    } catch (error) {
        console.log(error.message); 
    }           
}


// apply coupon for user
const applyCoupon = async (req, res) => {
  try {
      const id = req.session.user;
      const userid = new mongoose.Types.ObjectId(id._id);
      const address = await addressdatas.findOne({ user_id: userid });
      const cartItem = await cartdatas.find({ user_id: id });

      const couponCode = req.body.couponcode;
      const coupon = await coupondatas.find({ couponCode: couponCode });
      console.log(coupon);
      let total = 0; // Initialize total here

      for (let i = 0; i < cartItem[0].cart_items.length; i++) {
          total += cartItem[0].cart_items[i].product_price * cartItem[0].cart_items[i].quantity;
      }

      total = total + 500;

      if (coupon.length > 0) {
           let discount = (total * coupon[0].coupon_descount) / 100;
          total = total - discount;
          let status = req.session.coupon = true
          res.render('checkout', { address, cart: cartItem, total,  mssg: "Coupon Applied",status });
      } else {
          console.log('Invalid Coupon Code');
          res.render('checkout', { address, cart: cartItem, total, mssg: "Invalid Coupon Code" });
      }
  } catch (error) {
      console.log(error.message);
  }
};



// place order for user
const placeorder = async (req,res)=>{
  req.session.coupon = false
     const user_id =new mongoose.Types.ObjectId(req.session.user._id)
    const product = await cartdatas.findOne({user_id:user_id})
    const usename = req.session.user
    const user = await userdatas.findOne({_id:usename})
     let  address_id = new mongoose.Types.ObjectId( req.body.addres)
    const address = address_id
    const userr = await addressdatas.findOne({user_id:user_id})
    
   console.log(product.cart_items[0].product_id,'llllllllllllllllllllllllllllllll');
 

     const useraddress = await addressdatas.aggregate([
        {
          $match: {
            user_id: user_id
          }
        },
        {
          $unwind: '$addresses'
        },
        {
          $match: {
            'addresses._id': address_id
          }
        },
        {
          $project: {
            'addresses._id': 0, // Exclude the _id field in the result
            _id: 0, // Exclude the _id field
            user_id: 0, // Exclude the user_id field
            __v: 0 ,// Exclude the __v field
            
          }
        }
      ]);


 

     try {

      const Order= new orderdatas ({
       user_id : user_id,
       user_name: user.Username,
       order_address:useraddress,
       order_date:Date.now(),
       delevery_status:'pending',   
       total_price:req.body.total,
       payment_type:req.body.payment,
       product_details:product.cart_items
      })
      await Order.save()
      if(Order.payment_type == 'Razorpay'){
        var options = {
            amount: req.body.total*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+Order._id
          };
          instance.orders.create(options, function(err, order) {
            if(err){
                console.log("Error while creating order : ",err)
            }else{
                console.log("Order success =>", order.id)        
                res.json({order:order , razorpay:true}) 
            }
        });
      }else{
        console.log("Cod payment resoponseeee")
        res.json({cod:true})
      }
      console.log("Orders==>" , Order)
      for(let i=0 ;i< product.cart_items.length; i++){
 
        const updatedProduct = await productdatas.findByIdAndUpdate(
          { _id: product.cart_items[i].product_id },
          {
              $inc: { prdctstock: -product.cart_items[i].quantity } // Reduce the stock by the cart quantity
          },
          { new: true } // Return the updated document
      );
    }


      await cartdatas.deleteMany({user_id:user_id})

    } catch (error) {
        console.log(error.message); 
    }   
} 

// payment verificatin for user
const verifyPayment =async(req,res)=>{
    try{
        const userSession = req.session.user
        details = req.body;
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256' , '1zobkxWvTdKnldvuepL11wm2')
        hmac.update(details['response[razorpay_order_id]']+'|'+details['response[razorpay_payment_id]'])
        hmac = hmac.digest('hex');
             res.json(true)
      
    }catch{
        console.log("Catch error")
    }
}

//loading thankyou page for the order success
const thankyou = async (req,res)=>{
  try {
    res.render('thankyou')
  } catch (error) {
    console.log(error.message);
  }
}


  


// exporting all controllers
module.exports={  
    loadcart,
    addtocart,
    changeQuantity,
    deleteCartItem,
    loadcheckoutPage,
    placeorder,
    verifyPayment,
    thankyou,
    applyCoupon
}