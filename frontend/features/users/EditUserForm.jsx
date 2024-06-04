import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { useEffect, useState } from "react";
import { PWD_REGEX, ROLES, USER_REGEX } from "../../src/constants";
import { FaTrashAlt } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

export default function EditUserForm({ user }) {
	const [updateUser, { isLoading, isSuccess, isError, error }] =
		useUpdateUserMutation();
	const [deleteUser, { isSuccess: isDelSuccess, error: delError }] =
		useDeleteUserMutation();

	const navigate = useNavigate();

	const [username, setUsername] = useState(user.username);
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(user.roles);
	const [active, setActive] = useState(user.active);

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (isSuccess || isDelSuccess) {
			setUsername("");
			setPassword("");
			setRoles([]);
			navigate("/dash/users");
		}
	}, [isSuccess, isDelSuccess, navigate]);

	const onUsernameChanged = (e) => setUsername(e.target.value);
	const onPasswordChanged = (e) => setPassword(e.target.value);
	const onRolesChanged = (e) => {
		// allow more than one option to be selected
		const values = Array.from(
			e.target.selectionOptions, // HTMLCollection
			(option) => option.value
		);

		setRoles(values);
	};
	const onActiveChanged = () => setActive((prev) => !prev);

	const onSaveUserClicked = async () => {
		if (password) {
			await updateUser({ id: user.id, username, password, roles, active });
		} else {
			await updateUser({ id: user.id, username, roles, active });
		}
	};

	const onDeleteUserClicked = async (e) => {
		await deleteUser({ id: user.id });
	};

	const options = Object.values(ROLES).map((role) => (
		<option key={role} value={role}>
			{role}
		</option>
	));

	let canSave;
	if (password) {
		canSave =
			[roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
	} else {
		canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
	}

	const errClass = isError ? "errmsg" : "offscreen";
	const validUserClass = !validUsername ? "form__input--incomplete" : "";
	const validPasswordClass = !validPassword ? "form__input--incomplete" : "";
	const validRolesClass = !roles.length ? "form__input--incomplete" : "";

	const errContent = (error?.data?.message || delError?.data?.message) ?? "";

	const content = (
		<>
			<p className={errClass}>{errContent}</p>

			<form onSubmit={(e) => e.preventDefault()} className="form">
				<div className="form__title-row">
					<h2>Edit User</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							title="Save"
							disabled={!canSave}
							onClick={onSaveUserClicked}
						>
							<FaSave />
						</button>
						<button
							className="icon-button"
							title="Save"
							disabled={!canSave}
							onClick={onDeleteUserClicked}
						>
							<FaTrashAlt />
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

				<label
					htmlFor="user-active"
					className="form__label form__checkbox-container"
				>
					ACTIVE:{" "}
					<input
						className="form__checkbox"
						id="user-active"
						name="user-active"
						type="checkbox"
						checked={active}
						onChange={onActiveChanged}
					/>
				</label>

				<label htmlFor="roles" className="form__label">
					Assigned Roles:
				</label>
				<select
					id="roles"
					name="roles"
					className={`form__select ${validRolesClass}`}
					multiple={true}
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
