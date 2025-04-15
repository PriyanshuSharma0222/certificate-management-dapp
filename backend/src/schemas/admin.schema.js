import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  collection: 'admin'
});

export const adminModel = mongoose.model("admin", AdminSchema);
