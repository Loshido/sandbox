import { component$ } from "@builder.io/qwik";
import { Link, server$, useNavigate } from "@builder.io/qwik-city";

export const logout = server$(function() {

    this.cookie.delete('jwt', {
        path: "/",
    })
    this.cookie.delete('refresh', {
        path: "/"
    })
})

export default component$(() => {
    const nav = useNavigate()
    return <>
        <nav class="p-2 flex flex-row flex-wrap gap-2">
            <Link href="/">Page d'accueil</Link>
            <Link class="text-cyan-800" onClick$={async () => {
                await logout()
                nav('/login')
            }}>Se déconnecter</Link>
        </nav>
        <p class="p-4">
            Panneau d'administrations
            Accès non-authorisé
        </p>
    </>
})