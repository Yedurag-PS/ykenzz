const mongoose = require('mongoose')

const adminloginschema = new mongoose.Schema({
    adminname:{
       type:String,
       require:true
    },
    adminpassword:{ 
        type:String,
        require:true
    }
})
module.exports = mongoose.model("admindatas",adminloginschema)