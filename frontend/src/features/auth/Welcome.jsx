import { Link } from "react-router-dom";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";

export default function Welcome() {
	const { username, isManager, isAdmin } = useAuth();
	const today = `Today is ${format(new Date(), "EEEE, dd/MM/yyyy hh:mm a")}`;

	return (
		<section className="welcome">
			<p>{today}</p>
			<h1>Welcome {username || ""}!</h1>
			<p>
				<Link to="/dash/notes">View Tech Notes</Link>
			</p>
			<p>
				<Link to="/dash/notes/new">Add new Tech Notes</Link>
			</p>
			{(isAdmin || isManager) && (
				<p>
					<Link to="/dash/users">View User Settings</Link>
				</p>
			)}
			{(isAdmin || isManager) && (
				<p>
					<Link to="/dash/users/new">Add new User</Link>
				</p>
			)}
		</section>
	);
}
