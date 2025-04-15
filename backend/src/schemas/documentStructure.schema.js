import mongoose from "mongoose";

const docStructSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },
  info: {
    type: Object,
    required: true
  },
  meta: {
    type: Object,
    default: {},
  },
}, {
  collection: 'document_structure' // explicitly set the collection name
});

export const docStructModel = mongoose.model("document_structure", docStructSchema);
