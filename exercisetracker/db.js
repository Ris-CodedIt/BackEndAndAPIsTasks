const mongoose =  require("mongoose")

mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: {
        type: String,
        required: true
      },
});


const exerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
      },
    duration: {
        type: Number,
        required: true
      },
    date: {
        type: Date,
        required: true
      },
    user_id: {
        type: String,
        required: true
      },
});


let User = mongoose.model('User', userSchema)
let Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = {User, Exercise}