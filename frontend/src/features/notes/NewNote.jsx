import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

export default function NewNote() {
	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.ids.map((id) => data?.entities[id]),
		}),
	});

	if (!users.length) return <PulseLoader color="#fff" />;

	const content = <NewNoteForm users={users} />;

	return content;
}
