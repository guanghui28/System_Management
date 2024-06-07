const { logEvents } = require("./logger");

const handlerError = (err, req, res, next) => {
	logEvents(
		`${err.name}: ${err.message} - ${req.method} - ${req.url} - ${req.headers.origin}`,
		"errLog.log"
	);
	console.log(err.stack);
	const status = res.statusCode || 500;

	res.status(status).json({ message: err.message, isError: true });
};

module.exports = handlerError;
