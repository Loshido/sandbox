import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";
import { createClient } from "redis";

export default async function(requestEvent: RequestEvent | RequestEventAction | RequestEventBase) {
    const secret = requestEvent.env.get("REDIS")
    if(secret === undefined) throw new Error("env variable POSTGRES not found")
    
    return await createClient({
        url: secret
    }).connect()
}