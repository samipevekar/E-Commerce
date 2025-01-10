import mongoose from "mongoose";
const { Schema } = mongoose;


const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    addresses: {
        type: [Schema.Types.Mixed]
    },

    // TODO: we can make a separate Schema for this
    name: {
        type: String
    },
    orders: {
        type: [Schema.Types.Mixed]
    }

})

const virtual = userSchema.virtual('id');
virtual.get(function() {
    return this._id
})
userSchema.set('toJSON',{
    virtuals:true,
    virsionKey:false,
    transform: function(doc, ret, options) {delete ret._id}
})

export const User = mongoose.model('User',userSchema)