import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";

import { jwtVerify, SignJWT, type JWTPayload, decodeJwt } from "jose"
import _try from "./try";

export type Payload = JWTPayload & {
    id: number,
    email: string
}

export async function verify(jwt: string, requestEvent: RequestEvent | RequestEventAction | RequestEventBase) {
    const secret = requestEvent.env.get('SECRET')
    if(!secret) throw new Error('env variable SECRET not found')

    const secret_encoded = new TextEncoder()
        .encode(secret)

    const [ result ] = await _try(async () => await jwtVerify(jwt, secret_encoded, {
        audience: "sandbox-users",
        issuer: "sandbox-loshido"
    }))
    return result?.payload as Payload || undefined
}

export function decode(jwt: string) {
    return decodeJwt(jwt) as Payload
}

export async function sign(payload: Payload, duration: string, requestEvent: RequestEvent | RequestEventAction | RequestEventBase) {
    const secret = requestEvent.env.get('SECRET')
    if(!secret) throw new Error('env variable SECRET not found')

    const secret_encoded = new TextEncoder()
        .encode(secret)

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('sandbox-loshido')
        .setAudience('sandbox-users')
        .setExpirationTime(duration)
        .sign(secret_encoded)
}