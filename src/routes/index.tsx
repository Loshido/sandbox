import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Kashmir from "~/components/contents/Kashmir.jpg?jsx"

export default component$(() => {
	useStyles$(`body:has(#home) {
		height: 100svh;
		display: grid;
		grid-template-rows: auto 1fr;
	}`)

	return <section id="home" class="grid items-center justify-center 
		w-full h-full grid-cols-2 gap-16">
		<div class="ml-auto relative">
			<Kashmir id="kashmir" style="height: 75svh" class="rounded w-auto"  />
		</div>
		<div class="text">
			<h1 class="text-4xl font-bold max-w-lg">
				Ce site est un laboratoire 🧪,
				Vous y trouverez des expériences 
			</h1>
			<div class="flex flex-row gap-4 py-2">
				<a href="mailto:loshido@pm.me"
					class="text-teal-700 font-semibold 
					hover:font-light transition-all">
					loshido@pm.me
				</a>
				-
				<a href="https://github.com/Loshido"
					class="font-semibold 
					hover:font-light transition-all">
					Github
				</a>
			</div>
		</div>
	</section>
});

export const head: DocumentHead = {
	title: "Sandbox - Home",
	meta: [
		{
			name: "description",
			content: "Un site bac à sable pour tester, construire et detruire",
		},
	],
};
