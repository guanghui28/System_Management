import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetNotesQuery } from "./notesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";

const EditNote = () => {
	const { id } = useParams();
	const { username, isManager, isAdmin } = useAuth();

	const { note } = useGetNotesQuery("notesList", {
		selectFromResult: ({ data }) => ({
			note: data?.entities[id],
		}),
	});

	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.ids.map((id) => data?.entities[id]),
		}),
	});

	if (!note || !users.length) {
		return <PulseLoader color="#fff" />;
	}

	if (!isManager || !isAdmin) {
		if (note.username !== username) {
			return <p className="errmsg">No access</p>;
		}
	}

	return <EditNoteForm note={note} users={users} />;
};

export default EditNote;
