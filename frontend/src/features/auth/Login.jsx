import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

export default function Login() {
	const userRef = useRef(null);
	const errRef = useRef(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [persist, setPersist] = usePersist();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setUsername("");
			setPassword("");
			navigate("/dash");
		} catch (error) {
			if (!error.status) {
				setErrMsg("No Server Response");
			} else if (error.status === 400) {
				setErrMsg("Missing username or password");
			} else if (error.status === 401) {
				setErrMsg("You're unauthorized");
			} else {
				setErrMsg(error?.data?.message);
			}

			if (errRef.current) errRef.current.focus();
		}
	};

	const handleTogglePersist = () => setPersist((prev) => !prev);

	const errClass = errMsg ? "errmsg" : "offscreen";

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<section className="public">
			<header className="">
				<h1>Employee Login</h1>
			</header>
			<main className="login">
				<p ref={errRef} className={errClass} aria-live="assertive">
					{errMsg}
				</p>
				<form action="" className="form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username:</label>
					<input
						id="username"
						type="text"
						className="form__input"
						autoComplete="off"
						required
						ref={userRef}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						className="form__input"
						autoComplete="off"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button className="form__submit-button">Sign In</button>

					<label htmlFor="persist" className="form__persist">
						<input
							type="checkbox"
							className="form__checkbox"
							id="persist"
							onChange={handleTogglePersist}
							checked={persist}
						/>
						Trust this Device
					</label>
				</form>
			</main>
			<footer>
				<Link to="/">Back to home</Link>
			</footer>
		</section>
	);
}
