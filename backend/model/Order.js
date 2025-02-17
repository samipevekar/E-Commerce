import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentMethod = {
  values: ['cash','card'],
  message: 'only cash or card payment is allowed'
}
const orderSchema = Schema({
  items:{
      type: [Schema.Types.Mixed],
      required: true,
  },
  totalAmount: {
    type: Number,
    min: [0, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  totalItems: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // we can add enum types
  paymentMethod: {
    type: String,
    required: true,
    enum:paymentMethod
  },
  paymentStatus: {
    type:String,
    default:'pending'
  },
  status: {
    type: String,
    default: "pending",
  },
  selectedAddress: {
    type: Schema.Types.Mixed,
    required: true,
  },  
},{timestamps:true});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  virsionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

export const Order = mongoose.model("Order", orderSchema);
