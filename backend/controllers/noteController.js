const UserModel = require("../models/UserModel");
const NoteModel = require("../models/NoteModel");
const asyncHandler = require("../utils/asyncHandler");

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await NoteModel.find().populate({
		path: "user",
		select: "-password",
	});

	if (!notes.length) {
		return res.status(200).json({
			message: "No notes found!",
		});
	}

	res.status(200).json({ notes });
});

const createNewNote = asyncHandler(async (req, res) => {
	const { userId, title, text } = req.body;

	if (!userId || !title || !text) {
		return res.status(400).json({
			message: "All fields are required!",
		});
	}

	const existUser = await UserModel.findById(userId).lean();
	if (!existUser) {
		return res.status(400).json({
			message: "Check userId again!, userId not exist",
		});
	}

	const duplicateTitle = await NoteModel.findOne({ title }).lean();
	if (duplicateTitle) {
		return res.status(409).json({
			message: "This title has already existed!",
		});
	}

	const newNote = await NoteModel.create({
		user: userId,
		title,
		text,
	});

	if (newNote) {
		res.status(201).json({
			message: "New note created",
		});
	} else {
		res.status(400).json({
			message: "invalid data received",
		});
	}
});

const updateNote = asyncHandler(async (req, res) => {
	const { id, userId, title, text, completed } = req.body;

	if (!id || !userId || !title || !text || typeof completed !== "boolean") {
		return res.status(400).json({
			message: "All fields are required!",
		});
	}

	const note = await NoteModel.findById(id).exec();

	if (!note) {
		return res.status(404).json({
			message: "Note can't be found",
		});
	}

	const duplicateTitle = await NoteModel.findOne({ title }).lean();

	if (duplicateTitle && duplicateTitle?._id?.toString() !== id) {
		return res.status(409).json({
			message: "This title has already existed",
		});
	}

	note.user = userId;
	note.title = title;
	note.text = text;
	note.completed = completed;

	await note.save();

	res.status(200).json({
		message: "Update note success",
	});
});

const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({
			message: "You need to provide ID note",
		});
	}

	const note = await NoteModel.findById(id).lean();
	if (!note) {
		return res.status(404).json({
			message: "Note can't be found",
		});
	}

	await NoteModel.findByIdAndDelete(id);
	res.status(200).json({
		message: "Delete note success",
	});
});

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
};
