const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    name : {
        type:String,
        trim:true,
        required:true
    },
    qty : {
        type:Number,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    description: {
        type: String,
        trim: true
    },
    preview: {
        type: String,
        trim:true
    },
    category: {
        type: String,
        trim: true,
        required:true
    },
    cuisine: {
        type: String,
        trim:true
    },
    isVeg : {
        type:Boolean,
    }
}, {timestamps:true});

module.exports = mongoose.model('Item', itemSchema);