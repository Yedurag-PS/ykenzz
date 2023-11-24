const mongoose = require('mongoose')


const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    start_date:{
       type:Date,
       required:true
    },
    expired_date:{
        type:Date,
        required:true
    },
    coupon_descount:{
        type:Number,
        required:true
    }
})

module.exports = new mongoose.model('coupondatas',couponSchema)