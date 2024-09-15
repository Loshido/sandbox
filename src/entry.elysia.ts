/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Elysia when building for production.
 *
 * Learn more about the Elysia integration here:
 * - https://qwik.dev/docs/deployments/elysia/
 * - https://elysiajs.com/at-glance.html
 *
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/bun";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";
import { Elysia } from "elysia"
import { staticPlugin } from '@elysiajs/static'
import type { TLSOptions } from "bun";

// Create the Qwik City Bun middleware
const { router, notFound, staticFile } = createQwikCity({
	render,
	qwikCityPlan,
	manifest,
});

// Allow for dynamic port
const port = Number(Bun.env.PORT ?? 5173);

const tls: TLSOptions = {
	key: Bun.env.TLS_KEY ? Bun.file(Bun.env.TLS_KEY) : undefined,
	cert: Bun.env.TLS_CERT ? Bun.file(Bun.env.TLS_CERT) : undefined,
	ca: Bun.env.TLS_CA ? Bun.file(Bun.env.TLS_CA) : undefined,
	serverName: Bun.env.SERVER_NAME ? Bun.env.SERVER_NAME : undefined
}

const app = new Elysia({
	serve: {
		tls
	}
})
	.use(staticPlugin({
		assets: 'dist',
		prefix: '/'
	}))
	.mount('/', async (request: Request) => {
		const staticResponse = await staticFile(request);
		if (staticResponse) {
			return staticResponse;
		}
	
		// Server-side render this request with Qwik City
		const qwikCityResponse = await router(request);
		if (qwikCityResponse) {
			return qwikCityResponse;
		}
	
		// Path not found
		return notFound(request);
	})
	.listen(port, (server) => {
		console.info(`Elysia started on ${server.url}`)
	})

process.on('SIGINT', () => {
	app.stop(true)
	console.log(`Elysia stopped`)
	process.exit()
})