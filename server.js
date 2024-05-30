const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { logger } = require("./middleware/logger");
const handlerError = require("./middleware/handlerError");
const corsOptions = require("./config/corsOptions");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", require("./handleError/notfound"));
app.use(handlerError);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
