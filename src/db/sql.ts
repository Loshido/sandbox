import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";
import postgres from "postgres";

export default function(requestEvent: RequestEvent | RequestEventAction | RequestEventBase) {
    const secret = requestEvent.env.get("POSTGRES")
    if(secret === undefined) throw new Error("env variable POSTGRES not found")
    
    return postgres(secret, {
        max_lifetime: 5 + Math.floor(Math.random() * 5)
    })
}