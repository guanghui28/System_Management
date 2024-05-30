const { logEvents } = require("./logger");

const handlerError = (err, req, res, next) => {
	logEvents(
		`${err.name}: ${err.message} - ${req.method} - ${req.url} - ${req.headers.origin}`,
		"errLog.log"
	);
	console.log(err.stack);
	res.status(500).json({ message: err.message });
};

module.exports = handlerError;
