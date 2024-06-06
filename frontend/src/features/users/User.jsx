import { useNavigate } from "react-router-dom";
import { selectUserById } from "./usersApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";

export default function User({ userId }) {
	const dispatch = useDispatch();
	const user = useSelector((state) => selectUserById(state, userId));
	const navigate = useNavigate();

	if (!user) {
		return null;
	}

	const handleEdit = () => navigate(`/dash/users/${userId}`);
	const userRolesString = user.roles.toString().replaceAll(",", ", ");
	const cellStatus = user.active ? "" : "table__cell-inactive";

	return (
		<tr className="table__row user">
			<td className={`table__cell ${cellStatus}`}>{user.username}</td>
			<td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
			<td className={`table__cell ${cellStatus}`}>
				<button className="icon-button table__button" onClick={handleEdit}>
					<BsPencilSquare />
				</button>
			</td>
		</tr>
	);
}
