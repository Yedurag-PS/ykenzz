const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        require:true
    },
    addresses:[{
        firstname:{
            type:String,
            require:true
        },
        lastname:{
            type:String,
            require:true
        },
        mobilenumber:{
            type:Number,
            reqire:true
        },
        pincode:{
            type:Number,
            require:true
        },
        locality:{
            type:String,
            require:true
        },
        state:{ 
            type:String,
            require:true
        }
    }]
})

module.exports = new mongoose.model('addresdata',addressSchema)
