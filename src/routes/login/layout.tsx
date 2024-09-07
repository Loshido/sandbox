import { component$, Slot } from "@builder.io/qwik";

import Pillow from "~/components/contents/Mitti.jpg?jsx"

export default component$(() => <section 
    id="login" 
    class="w-full h-svh grid
    lg:grid-cols-2 overflow-hidden">
    <Pillow 
        style={{height: "100svh"}} 
        class="object-cover absolute lg:static -z-10 lg:z-0" />
    <Slot />
</section>)

import type { RequestHandler } from '@builder.io/qwik-city';

import { verify } from "~/fn/jwt";
// import postgres from "~/db/sql"
import refresh from "~/fn/refresh";
export const onGet: RequestHandler = async (requestEvent) => {
    // Is there a token ?
    const jwt = requestEvent.cookie.get('jwt')
    if(jwt) {
        // Is it valid ?
        const payload = await verify(jwt.value, requestEvent)
        
        // Then redirect
        if(payload) throw requestEvent.redirect(302, '/dash')
    }
    
    // Otherwise, is there a refresh token ?
    const refreshToken = requestEvent.cookie.get('refresh')
    if(!refreshToken) return

    // Is it valid ?
    const refreshPayload = await verify(refreshToken.value, requestEvent)
    
    // Definitly not logged
    if(!refreshPayload) return

    await refresh(refreshPayload, requestEvent)
    throw requestEvent.redirect(302, '/dash')
};