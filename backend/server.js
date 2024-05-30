const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middleware/logger");
const handlerError = require("./middleware/handlerError");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDB");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoute"));
app.use("/notes", require("./routes/noteRoute"));

app.all("*", require("./handleError/notfound"));
app.use(handlerError);

mongoose.connection.once("open", () => {
	console.log("Connected to DB success!");
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code} - ${err.syscall} - ${err.hostname}`,
		"mongoErrLog.log"
	);
});

mongoose.connection.on("disconnect", () => {
	console.log("Mongoose disconnect from DB");
});
