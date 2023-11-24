const mongoose = require('mongoose')

const usrsignupSchema = new mongoose.Schema({
    Username:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Mobilenumber:{
        type:Number,
        require:true
    },
    isListed:{
        type:Boolean,
        require:true
    },
    Wallet :{    
        type:Number,
        require:true
    }
})

module.exports = mongoose.model("userdatas",usrsignupSchema)     
