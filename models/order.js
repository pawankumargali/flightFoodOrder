const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    item: { 
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Item',
        required:true
    },
    qty: {
        type:Number,
        required:true
    }
})

const orderSchema = new mongoose.Schema({
    passengerName : {
        type:String,
        trim:true,
        required:true
    },
    seatNumber : {
        type:String,
        trim:true,
        required:true
    },
    items: [{type:itemSchema}],
    bill: {
        type:Number,
        required:true
    }
}, {timestamps:true});

module.exports = mongoose.model('Order', orderSchema);