import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Prefetch() {
	useEffect(() => {
		const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
		const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		return () => {
			users.unsubscribe();
			notes.unsubscribe();
		};
	}, []);

	return <Outlet />;
}
