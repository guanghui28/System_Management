import { Link, useLocation, useNavigate } from "react-router-dom";
import { USERS_REGEX, DASH_REGEX, NOTES_REGEX } from "../constants";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import { FaUserPlus, FaPlusCircle } from "react-icons/fa";
import { FaUserGear, FaFilePen } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

export default function DashHeader() {
	const { isManager, isAdmin } = useAuth();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [sendLogout, { isLoading, isSuccess, isError, error }] =
		useSendLogoutMutation();

	const handleLogout = async () => {
		try {
			await sendLogout().unwrap();
			navigate("/login");
		} catch (error) {
			console.log("Failed to logout: ", error);
		}
	};

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	const onNewNoteClicked = () => navigate("/dash/notes/new");
	const onNewUserClicked = () => navigate("/dash/users/new");
	const onNotesClicked = () => navigate("/dash/notes");
	const onUsersClicked = () => navigate("/dash/users");

	if (isLoading) return <p>Logging out...</p>;

	if (isError) return <p>Error: {error?.data?.message}</p>;

	let dashClass = null;
	if (
		!DASH_REGEX.test(pathname) &&
		!NOTES_REGEX.test(pathname) &&
		!USERS_REGEX.test(pathname)
	) {
		dashClass = "dash-header__container--small";
	}

	let newNoteButton = null;
	if (NOTES_REGEX.test(pathname)) {
		newNoteButton = (
			<button
				className="icon-button"
				title="New Note"
				onClick={onNewNoteClicked}
			>
				<FaPlusCircle />
			</button>
		);
	}

	let newUserButton = null;
	if (USERS_REGEX.test(pathname)) {
		newUserButton = (
			<button
				className="icon-button"
				title="New User"
				onClick={onNewUserClicked}
			>
				<FaUserPlus />
			</button>
		);
	}

	let userButton = null;
	if (isAdmin || isManager) {
		if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
			userButton = (
				<button className="icon-button" title="Users" onClick={onUsersClicked}>
					<FaUserGear />
				</button>
			);
		}
	}

	let noteButton = null;
	if (isAdmin || isManager) {
		if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
			noteButton = (
				<button className="icon-button" title="Notes" onClick={onNotesClicked}>
					<FaFilePen />
				</button>
			);
		}
	}

	const logoutButton = (
		<button className="icon-button" title="Logout" onClick={handleLogout}>
			<IoLogOut />
		</button>
	);

	const errClass = isError ? "errmsg" : "offscreen";

	let buttonContent = null;
	if (isLoading) {
		buttonContent = <PulseLoader color="#fff" />;
	} else {
		buttonContent = (
			<>
				{newNoteButton}
				{newUserButton}
				{noteButton}
				{userButton}
				{logoutButton}
			</>
		);
	}

	return (
		<>
			<p className={errClass}>{error?.data?.message}</p>

			<header className="dash-header">
				<div className={`dash-header__container ${dashClass}`}>
					<Link to="/dash/notes">
						<h1 className="dash-header__title">techNotes</h1>
					</Link>
					<nav className="dash-header__nav">{buttonContent}</nav>
				</div>
			</header>
		</>
	);
}
