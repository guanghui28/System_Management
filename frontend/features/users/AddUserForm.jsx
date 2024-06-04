import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES, USER_REGEX, PWD_REGEX } from "../../src/constants";
import { FaSave } from "react-icons/fa";
import { useAddNewUserMutation } from "./usersApiSlice";

export default function AddUserForm() {
	const [addNewUser, { isLoading, isSuccess, isError, error }] =
		useAddNewUserMutation();

	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [validUsername, setValidUsername] = useState(false);
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(["Employee"]);

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (isSuccess) {
			setUsername("");
			setPassword("");
			setRoles([]);
			navigate("/dash/users");
		}
	}, [isSuccess, navigate]);

	const onUsernameChanged = (e) => setUsername(e.target.value);
	const onPasswordChanged = (e) => setPassword(e.target.value);
	const onRolesChanged = (e) => {
		// allow more than one option to be selected
		const values = Array.from(
			e.target.selectedOptions // HTMLCollection
		).map((option) => option.value);

		setRoles(values);
	};

	const canSave =
		[roles.length, validPassword, validUsername].every(Boolean) && !isLoading;

	const onSaveUserClicked = async (e) => {
		e.preventDefault();

		if (canSave) {
			await addNewUser({ username, password, roles });
		}
	};

	const options = Object.values(ROLES).map((role) => (
		<option key={role} value={role}>
			{role}
		</option>
	));

	const errClass = isError ? "errmsg" : "offscreen";
	const validUserClass = !validUsername ? "form__input--incomplete" : "";
	const validPasswordClass =
		password && !validPassword ? "form__input--incomplete" : "";
	const validRolesClass = !roles.length ? "form__input--incomplete" : "";

	let content = (
		<>
			<p className={errClass}>{error?.data?.message}</p>

			<form className="form" onSubmit={onSaveUserClicked}>
				<div className="form__title-row">
					<h2>Add New User</h2>
					<div className="form__action-buttons">
						<button className="icon-button" title="Save" disabled={!canSave}>
							<FaSave />
						</button>
					</div>
				</div>
				<label htmlFor="username" className="form__label">
					Username: <span className="nowrap">[3-20 letters]</span>
				</label>
				<input
					type="text"
					className={`form__input ${validUserClass}`}
					id="username"
					name="username"
					autoComplete="off"
					value={username}
					onChange={onUsernameChanged}
				/>

				<label htmlFor="password" className="form__input">
					Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
				</label>
				<input
					type="password"
					className={`form__input ${validPasswordClass}`}
					id="password"
					name="password"
					autoComplete="off"
					value={password}
					onChange={onPasswordChanged}
				/>

				<label htmlFor="roles" className="form__label">
					Assigned Roles:
				</label>
				<select
					id="roles"
					name="roles"
					className={`form__select ${validRolesClass}`}
					multiple
					size="3"
					value={roles}
					onChange={onRolesChanged}
				>
					<option value="">Select roles</option>
					{options}
				</select>
			</form>
		</>
	);

	return content;
}
