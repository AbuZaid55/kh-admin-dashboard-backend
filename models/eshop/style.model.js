const mongoose = require("mongoose");

const StyleSchema_eshop = new mongoose.Schema({
  name: { type: String, required: true},
});

const Style_eshop = mongoose.model("Style_eshop", StyleSchema_eshop);

module.exports = Style_eshop
