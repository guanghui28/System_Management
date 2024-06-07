import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PuffLoader";

export default function EditUser() {
	const { id } = useParams();

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[id],
		}),
	});

	if (!user) {
		return <PulseLoader color="#fff" />;
	}

	return <EditUserForm user={user} />;
}
