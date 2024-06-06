import { useSelector } from "react-redux";
import NewNoteForm from "./NewNoteForm";
import { selectAllUsers } from "../users/usersApiSlice";

export default function NewNote() {
	const users = useSelector(selectAllUsers);

	if (!users.length) return <p>Not currently available</p>;

	const content = <NewNoteForm users={users} />;

	return content;
}
