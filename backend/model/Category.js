import mongoose from "mongoose";
const { Schema } = mongoose;


const categorySchema = Schema({
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

const virtual = categorySchema.virtual('id');
virtual.get(function() {
    return this._id
})
categorySchema.set('toJSON',{
    virtuals:true,
    virsionKey:false,
    transform: function(doc, ret, options) {delete ret._id}
})

export const Category = mongoose.model('Category',categorySchema)