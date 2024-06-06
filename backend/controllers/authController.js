const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	const foundUser = await UserModel.findOne({ username }).exec();

	if (!foundUser || !foundUser.active) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const match = await bcrypt.compare(password, foundUser.password);

	if (!match) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	// generate access token and refresh token
	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15s",
		}
	);

	const refreshToken = jwt.sign(
		{
			username: foundUser.username,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "20s",
		}
	);

	// Create secure cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true, // accessible only web server
		secure: true, // https
		sameSite: "None", //cross-site cookie
		maxAge: 24 * 60 * 60 * 1000, // expire in 1day - set to match with refresh token
	});

	res.json({ accessToken });
});

const refresh = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: "Forbidden" });
			}

			const foundUser = await UserModel.findOne({
				username: decoded.username,
			}).exec();

			if (!foundUser) {
				return res.status(401).json({ message: "Unauthorized" });
			}

			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "15s",
				}
			);

			res.json({ accessToken });
		})
	);
};

const logout = asyncHandler(async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		return res.sendStatus(204);
	}
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	res.json({ message: "Cookie cleared" });
});

module.exports = { login, refresh, logout };
