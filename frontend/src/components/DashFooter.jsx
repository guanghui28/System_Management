import { useLocation, useNavigate } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";

export default function DashFooter() {
	const { username, status } = useAuth();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const onGoHomeClicked = () => navigate("/dash");

	return (
		<footer className="dash-footer">
			{pathname !== "/dash" && (
				<button
					className="dash-footer__button icon-button"
					title="Home"
					onClick={onGoHomeClicked}
				>
					<FaHouseChimney />
				</button>
			)}
			<p>Current user: {username}</p>
			<p>Status: {status}</p>
		</footer>
	);
}
