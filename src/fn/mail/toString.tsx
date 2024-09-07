import { renderToString } from '@builder.io/qwik/server'; 

export default async function(slot: unknown) {
    const mail = await renderToString(slot, {
        locale: 'fr',
        qwikPrefetchServiceWorker: {
            include: false
        },
        qwikLoader: {
            include: 'never'
        }
    })
    return mail.html
}