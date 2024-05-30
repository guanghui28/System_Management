import { useLocation, useNavigate } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";

export default function DashFooter() {
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
			<p>Current user: </p>
			<p>Status: </p>
		</footer>
	);
}
