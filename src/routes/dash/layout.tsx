import type { RequestHandler, DocumentHead } from '@builder.io/qwik-city';

import refresh from '~/fn/refresh';
import { verify } from "~/fn/jwt";
export const onGet: RequestHandler = async (requestEvent) => {
    // Is there a token ?
    const jwt = requestEvent.cookie.get('jwt')
    if(!jwt) throw requestEvent.redirect(302, '/login')
    
    // Is it valid ?
    const payload = await verify(jwt.value, requestEvent)
    
    // Logged
    if(payload) return
    
    // Otherwise, is there a refresh token ?
    const refreshToke = requestEvent.cookie.get('refresh')
    if(!refreshToke) throw requestEvent.redirect(302, '/login')

    // Is it valid ?
    const refreshPayload = await verify(refreshToke.value, requestEvent)
    
    // Definitly not logged
    if(!refreshPayload) throw requestEvent.redirect(302, '/login')
    
    // Refresh tokens
    await refresh(refreshPayload, requestEvent);
};

export const head: DocumentHead = (props) => ({
	title: `dashboard`,
	frontmatter: {
        header: false
    }
});
