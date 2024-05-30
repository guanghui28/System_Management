const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
		});
	} catch (error) {
		console.log("Error when connecting DB: ", error);
	}
};

module.exports = connectDB;
