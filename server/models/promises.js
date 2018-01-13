const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/polipro', {
  useMongoClient: true,
});

const promiseSchema = new Schema({
  id: Number,
  title: String,
  timeStamp: String,
  votes: Number
});

var Topics = mongoose.model("promises", promiseSchema);

exports.readAll = ctx => {
  return Topics.find({}, function(err, promises) {
    if (err) throw err;
    return promises;
  });
};

exports.writeOne = data => {
  console.log(data);
  Topics({
    title: data.auttitlehor,
    timeStamp: data.timeStamp,
    votes: data.votes
  }).save();
};
