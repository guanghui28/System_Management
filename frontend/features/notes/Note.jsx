import { selectNoteById } from "./notesApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

export default function Note({ noteId }) {
	const navigate = useNavigate();

	const note = useSelector((state) => selectNoteById(state, noteId));

	if (!note) return null;

	const created = new Date(note.createdAt).toLocaleString("vn-VN", {
		day: "numeric",
		month: "long",
	});

	const updated = new Date(note.updatedAt).toLocaleString("vn-VN", {
		day: "numeric",
		month: "long",
	});

	const handleEdit = () => navigate(`/dash/notes/${noteId}`);

	return (
		<tr className="table__row">
			<td className="table__cell note__status">
				{note.completed ? (
					<span className="note__status--completed">Completed</span>
				) : (
					<span className="note__status--open">Open</span>
				)}
			</td>
			<td className="table__cell note__created">{created}</td>
			<td className="table__cell note__updated">{updated}</td>
			<td className="table__cell note__title">{note.title}</td>
			<td className="table__cell note__username">{note.user.username}</td>

			<td className="table__cell">
				<button className="icon-button table__button" onClick={handleEdit}>
					<BsPencilSquare />
				</button>
			</td>
		</tr>
	);
}
