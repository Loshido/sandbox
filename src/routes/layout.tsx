import { component$, Slot } from "@builder.io/qwik";
import { type RequestHandler, type DocumentHead, useDocumentHead } from "@builder.io/qwik-city";
import Header from "~/components/header";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	// Control caching for this request for best performance and to reduce hosting costs:
	// https://qwik.dev/docs/caching/
	cacheControl({
		// Always serve a cached response by default, up to a week stale
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
		maxAge: 5,
	});
};

export default component$(() => {
	const head = useDocumentHead()
	return <>
		{
			head.frontmatter.header !== false
			? <Header/>
			: null
		}
		<Slot/>
	</>;
});

export const head: DocumentHead = (props) => ({
	title: `Sandbox - ${props.head.title}`,
	meta: [
		{
			name: "description",
			content: "Un site bac à sable pour tester, construire et detruire",
		},
	],
});
