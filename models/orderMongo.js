const   mongoose = require('mongoose')

const ordreSchema = new mongoose.Schema({
    user_id :{
        type:mongoose.Types.ObjectId,
        require:true
    },
    user_name:{
        type:String,
        require:true
    },
    order_address:{
        type:Object,
        require:true
    },
    order_date:{
        type:Date
    },
    delevery_status:{
        type:String,
        require:true
    },
    total_price:{
        type:String,
        require:true
    },
    payment_type:{
        type:String,
        require:true
    },
    product_details:{
        type:Array,
        require:true
    },
    return_reason:{
        type:String
    }

})

module.exports = new mongoose.model('orderdata', ordreSchema)