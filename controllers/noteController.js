const UserModel = require("../models/UserModel");
const NoteModel = require("../models/NoteModel");
const asyncHandler = require("../utils/asyncHandler");

const getAllNotes = asyncHandler(async (req, res) => {});

const createNewNote = asyncHandler(async (req, res) => {});

const updateNote = asyncHandler(async (req, res) => {});

const deleteNote = asyncHandler(async (req, res) => {});

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
};
