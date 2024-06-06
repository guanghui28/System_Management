import { Link, useLocation, useNavigate } from "react-router-dom";
import { USERS_REGEX, DASH_REGEX, NOTES_REGEX } from "../constants";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { IoLogOut } from "react-icons/io5";

export default function DashHeader() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [sendLogout, { isLoading, isSuccess, isError, error }] =
		useSendLogoutMutation();

	const handleLogout = async () => {
		try {
			await sendLogout().unwrap();
			console.log("Logout success");
		} catch (error) {
			console.log("Failed to logout: ", error);
		}
	};

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	if (isLoading) return <p>Logging out...</p>;

	if (isError) return <p>Error: {error.data?.message}</p>;

	let dashClass = null;
	if (
		!DASH_REGEX.test(pathname) &&
		!NOTES_REGEX.test(pathname) &&
		!USERS_REGEX.test(pathname)
	) {
		dashClass = "dash-header__container--small";
	}

	const logoutButton = (
		<button className="icon-button" title="Logout" onClick={handleLogout}>
			<IoLogOut />
		</button>
	);

	return (
		<header className="dash-header">
			<div className={`dash-header__container ${dashClass}`}>
				<Link to="/dash/notes">
					<h1 className="dash-header__title">techNotes</h1>
				</Link>
				<nav className="dash-header__nav">
					{/* TODO: add more buttons later */}
					{logoutButton}
				</nav>
			</div>
		</header>
	);
}
