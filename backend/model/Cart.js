import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  size:{
    type: Schema.Types.Mixed
  },
  color:{
    type: Schema.Types.Mixed
  },
},{timestamps:true});

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
cartSchema.set("toJSON", {
  virtuals: true,
  virsionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
