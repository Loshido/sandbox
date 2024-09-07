import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";
import type { Payload } from "./jwt";

import postgres from "~/db/sql"
import { sign } from "./jwt"
export default async function(payload: Payload, requestEvent: RequestEvent | RequestEventAction | RequestEventBase) {
    const sql = postgres(requestEvent)
    
    // Check for an user
    const rows = await sql`SELECT 1 FROM users
        WHERE id = ${payload.id};`;
    
    if(rows.count !== 1) return

    // Resigns token
    const newJwt = await sign(payload, '15min', requestEvent)
    const refresh_jwt = await sign(payload, '8 weeks', requestEvent)

    // Attaches onto the browser
    const dev = requestEvent.env.get('DEV')
    requestEvent.cookie.set('jwt', newJwt, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4),
        httpOnly: dev ? false : true,
        secure: dev ? false : true
    })
    requestEvent.cookie.set('refresh', refresh_jwt, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4),
        httpOnly: dev ? false : true,
        secure: dev ? false : true
    })
}