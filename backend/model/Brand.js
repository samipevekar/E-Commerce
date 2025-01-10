import mongoose from "mongoose";
const { Schema } = mongoose;


const brandSchema = Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true,
        unique: true
    },

})

const virtual = brandSchema.virtual('id');
virtual.get(function() {
    return this._id
})
brandSchema.set('toJSON',{
    virtuals:true,
    virsionKey:false,
    transform: function(doc, ret, options) {delete ret._id}
})

export const Brand = mongoose.model('Brand',brandSchema)