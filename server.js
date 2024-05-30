const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", require("./handleError/notfound"));

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
