import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";

import hash from "hash.js"
export default function(password: string, requestEvent: RequestEvent | RequestEventAction | RequestEventBase): string {
    const secret = requestEvent.env.get("SECRET")
    if(!secret) throw new Error('env variable SECRET not found')

    const sha256 = hash.sha256()
    return sha256
        .update(password)
        .update(secret)
        .digest('hex')
}