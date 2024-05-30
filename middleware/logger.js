const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");

const logEvents = async (msg, fileName) => {
	const dateTime = format(new Date(), "dd/MM/yyyy hh:mm:ss a");
	const message = `${dateTime} ${uuid()} ${msg}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
		}
		await fsPromise.appendFile(
			path.join(__dirname, "..", "logs", fileName),
			message
		);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const logger = (req, res, next) => {
	logEvents(`${req.method} - ${req.url} - ${req.headers.origin}`, "reqLog.log");
	next();
};

module.exports = { logEvents, logger };
