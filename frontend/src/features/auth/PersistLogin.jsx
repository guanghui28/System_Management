import { useSelector } from "react-redux";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { Link, Outlet } from "react-router-dom";

export default function PersistLogin() {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);
	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
		useRefreshMutation();

	useEffect(() => {
		if (effectRan.current || process.env.NODE_ENV !== "development") {
			const verifyRefreshToken = async () => {
				console.log("Verifying refresh token");
				try {
					await refresh();

					setTrueSuccess(true);
				} catch (error) {
					console.log(error);
				}
			};

			if (!token && persist) verifyRefreshToken();
		}

		return () => (effectRan.current = true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let content;

	if (!persist) {
		content = <Outlet />;
	} else if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isError) {
		content = (
			<p className="errmsg">
				{`${error?.data?.message} - `}{" "}
				<Link to="/login">Please login again!</Link>
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		// persist: yes, token: yes
		content = <Outlet />;
	} else if (token && isUninitialized) {
		content = <Outlet />;
	}

	return content;
}
