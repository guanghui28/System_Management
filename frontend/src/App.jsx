import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "../features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "../features/auth/Welcome";
import NotesList from "../features/notes/NotesList";
import UsersList from "../features/users/UsersList";
import EditNote from "../features/notes/EditNote";
import AddNoteForm from "../features/notes/AddNoteForm";
import EditUser from "../features/users/EditUser";
import AddUserForm from "../features/users/AddUserForm";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				<Route path="dash" element={<DashLayout />}>
					<Route index element={<Welcome />} />

					<Route path="notes">
						<Route index element={<NotesList />} />
						<Route path=":id" element={<EditNote />} />
						<Route path="new" element={<AddNoteForm />} />
					</Route>

					<Route path="users">
						<Route index element={<UsersList />} />
						<Route path=":id" element={<EditUser />} />
						<Route path="new" element={<AddUserForm />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}
