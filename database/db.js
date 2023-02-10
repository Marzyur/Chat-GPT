const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(`mongodb://localhost:27017/googleAuthDB`, {
            useNewUrlParser: true
          });
        console.log(`MongoDB Connected...`);
    } catch (err) {
        console.error(err);
    }

}

module.exports = connectDB;