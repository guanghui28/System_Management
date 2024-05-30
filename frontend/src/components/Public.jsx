import { Link } from "react-router-dom";

export default function Public() {
	return (
		<section className="public">
			<header>
				<h1>
					Welcome to <span className="nowrap">GuangHui&apos;s Repair</span>
				</h1>
			</header>
			<main className="public__main">
				<p>
					Located in Beautiful Downtown Foo City, GuangHui Repairs provides a
					trained staff ready to meet your tech repair needs.
				</p>
				<address className="public__addr">
					GuangHui
					<br />
					555 Foo Drive
					<br />
					Foo City, CA 12345
					<br />
					<a href="tel:+15555555555">(555) 555-5555</a>
				</address>
				<br />
				<p>Owner: GuangHui</p>
			</main>
			<footer>
				<Link to="/login">Employee Login</Link>
			</footer>
		</section>
	);
}
