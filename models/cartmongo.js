const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        require:true
    },
    cart_items:[{
        product_id: {
            type:mongoose.Types.ObjectId,
            require:true
        },
        product_name:{
            type:String,
            require:true
        },
        product_price:{
            type:Number,
            require:true
        },
        quantity:{  
            type:Number,
            require:true
        },
        product_image:{
            type:Array,
            require:true
        }
    }],
})

module.exports = mongoose.model('cart',cartSchema)

