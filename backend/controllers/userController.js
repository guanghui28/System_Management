const UserModel = require("../models/UserModel");
const NoteModel = require("../models/NoteModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await UserModel.find().select("-password").lean();

	if (!users.length) {
		return res.status(200).json({ message: "Have not users yet" });
	}

	res.status(200).json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;

	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	const existedUser = await UserModel.findOne({ username }).lean();

	if (existedUser) {
		return res.status(409).json({ message: "username has already existed!" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await UserModel.create({
		username,
		password: hashedPassword,
		roles,
	});

	if (newUser) {
		res.status(201).json({
			message: "Create new user success",
			newUser,
		});
	} else {
		res.status(500).json({ message: "Error when creating..." });
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body;

	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	) {
		return res.status(400).json({
			message: "All field are required!",
		});
	}

	const user = await UserModel.findById(id).exec();

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const duplicate = await UserModel.findOne({ username }).exec();

	if (duplicate && duplicate?._id?.toString() !== id) {
		return res.status(409).json({
			message: "Duplicate username",
		});
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		user.password = hashedPassword;
	}
	const updateUser = await user.save();

	res.json({
		message: `${updateUser.username} updated`,
	});
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "User ID required!" });
	}

	const note = await NoteModel.findOne({ user: id }).lean();

	if (note) {
		return res.status(400).json({ message: "User has assigned notes" });
	}

	const user = await UserModel.findById(id).exec();

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	await UserModel.findByIdAndDelete(id);

	res.status(200).json({
		message: "delete user success",
	});
});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
