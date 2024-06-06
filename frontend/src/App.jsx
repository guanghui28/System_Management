import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Prefetch from "./features/auth/Prefetch";

import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";

import PersistLogin from "./features/auth/PersistLogin";

import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import NotesList from "./features/notes/NotesList";

import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import AddUserForm from "./features/users/AddUserForm";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				<Route element={<PersistLogin />}>
					<Route element={<Prefetch />}>
						<Route path="dash" element={<DashLayout />}>
							<Route index element={<Welcome />} />

							<Route path="notes">
								<Route index element={<NotesList />} />
								<Route path=":id" element={<EditNote />} />
								<Route path="new" element={<NewNote />} />
							</Route>

							<Route path="users">
								<Route index element={<UsersList />} />
								<Route path=":id" element={<EditUser />} />
								<Route path="new" element={<AddUserForm />} />
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}
