import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  rarity: String,
  levelReq: Number,
  class: String,
  dropLevel: Number,
  league: String,
  dropAreas: [String],
  statReq: {
    int: Number,
    str: Number,
    dex: Number
  },
  flavor: String,
  tags: [String],
  icon: String,
  base: String,
  implicitMods: [
    {
      text: String,
      min: { min: Number, max: Number },
      max: { min: Number, max: Number }
    }
  ],
  explicitMods: [
    {
      text: String,
      min: { min: Number, max: Number },
      max: { min: Number, max: Number }
    }
  ]
});

export default mongoose.model('Item', schema);
