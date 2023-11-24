const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    prdctname:{
        type:String,
        require:true
    },
    prdctdescription:{
        type:String,
        require
    },
    prdctprice:{
        type:Number,
        require:true
    },
    prdctofferprice:{
        type:Number,
        require:true
    },
    prdctimage:{
        type:Array,
        require:true
    },
    prdctislisted:{
        type:Boolean
    },
    prdctcategory:{ 
        type:String,
        require:true
    },
    prdctstock:{
        type:Number,
        require:true
    }
})

module.exports = new mongoose.model('productdatas',productSchema)