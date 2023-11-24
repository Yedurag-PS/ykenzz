const mongoose = require ('mongoose')


const categorySchema = new mongoose.Schema({
    Categoryname:{
        type:String,
        require:true
    },
    Categoryislisted:{
        type:Boolean,
        require:true
    },
    Categoryimage:{
        type:Array,
        require:true
    }
})

module.exports = new mongoose.model('categorydatas',categorySchema)
