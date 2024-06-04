import { useSelector } from "react-redux";
import NewNoteForm from "./NewNoteForm";
import { selectAllUsers } from "../users/usersApiSlice";

export default function NewNote() {
	const users = useSelector(selectAllUsers);
	console.log(users);
	const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

	return content;
}
