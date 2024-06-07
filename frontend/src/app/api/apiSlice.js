import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3000",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	console.log(args); // request url, method, body
	console.log(api); // signal, dispatch, getState()
	console.log(extraOptions); // custom like {shout: true}

	let result = await baseQuery(args, api, extraOptions);

	// handle status
	if (result?.error?.status === 403) {
		console.log("=====SENDING REFRESH TOKEN=====");

		// send refresh token to get new access token
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			//store the new token
			api.dispatch(setCredentials({ ...refreshResult.data }));

			//retry original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired.";
			}

			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Note", "User"],
	endpoints: (builder) => ({}),
});
