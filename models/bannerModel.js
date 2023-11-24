const mongoose = require('mongoose')

const bannerShema = new mongoose.Schema({
    description:{
         type:String,
         require:true
    },
    Image:{
        type:String,
        require:true
    }
})

module.exports = new mongoose.model('bannerdatas',bannerShema)