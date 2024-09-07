import { component$, useStore } from "@builder.io/qwik";
import { Form, Link, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";

import Return from "~/components/utils/buttons/return"

type User = {
    email: string,
    id: number,
    confirmed: number
}

import postgres from "~/db/sql"
import hash from "~/fn/hash";
import { sign } from "~/fn/jwt";
export const useLogin = routeAction$(async (data, requestEvent) => {
    const sql = postgres(requestEvent)

    const password = hash(data.password, requestEvent)
    const [ user ] = await sql<[ User? ]>`SELECT email, id, confirmed
        FROM users
        WHERE email = ${data.email} AND password = ${password}`
    
    if(user && user.confirmed == 2) {
        const jwt = await sign(user, '15min', requestEvent)
        const refresh_jwt = await sign(user, '8 weeks', requestEvent)
        console.log(jwt, refresh_jwt)

        const dev = requestEvent.env.get('DEV')
        requestEvent.cookie.set('jwt', jwt, {
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

        throw requestEvent.redirect(302, '/dash')
    } else if(user && user.confirmed == 1) return {
        failed: true,
        message: "⚠️ Votre adresse email n'est pas vérifié."
    }
    else if(user && user.confirmed == 0) return {
        failed: true,
        message: "⚠️ Votre enregistrement n'est pas approuvé à ce jour."
    }
    return {
        failed: true,
        message: "⚠️ Vos identifiants sont incorrects."
    }
    
}, zod$({
    email: z.string()
        .email("L'adresse email ne convient pas.")
        .min(6, "L'adresse email doit contenir plus de 6 caractères."),
    password: z.string()
        .min(6, "Le mot de passe doit contenir plus de 6 caractères.")
}))

export default component$(() => {
    const login = useLogin()
    const values = useStore({
        email: "",
        password: ""
    })

    return <div class="p-12 grid gap-2" style="grid-template-rows: auto 1fr">
        <div class="flex flex-row flex-wrap w-full justify-between h-1/4">
            <Return />
            <p class="text-right w-2/3">
                Ce tableau de board est un réceptacle et un chef d'orchestre 🎻 pour plusieurs projets. 
            </p>
        </div>

        <Form action={login}
            class="flex flex-col gap-4 py-4 items-center justify-center">
            <label class="w-2/3 flex flex-col">
                <input 
                    name="email"
                    onInput$={(_, el) => values.email = el.value}
                    type="email" id="email"
                    placeholder="votre@adresse.email"
                    class={[
                        "p-3 text-xl border-2 rounded w-full",
                        values.email.length < 6 ? 'border-red-200' : 'border-zinc-200'
                    ]} />
                {
                    values.email.length < 6
                    ? <span class="py-1 font-thin text-sm">
                        Votre adress email doit contenir plus de 6 caractères.
                    </span> 
                    : null
                }
            </label>

            <label class="w-2/3 flex flex-col">
                <input 
                    name="password"
                    onInput$={(_, el) => values.password = el.value}
                    type="password" id="password"
                    placeholder="vtreMot2pas"
                    class={[
                        "p-3 text-xl border-2 rounded w-full",
                        values.password.length < 6 ? 'border-red-200' : 'border-zinc-200'
                    ]} />
                {
                    values.password.length < 6 
                    ? <span class="py-1 font-thin text-sm">
                        Votre mot de passe doit contenir plus de 6 caractères.
                    </span> 
                    : null
                }
            </label>

            <input 
                disabled={values.email.length < 6 || values.password.length < 6}
                type="submit" value="Se connecter"
                class="p-3 text-xl border-2 border-zinc-500 rounded w-2/3
                bg-zinc-700 text-white disabled:bg-zinc-400
                    disabled:border-zinc-100 transition-colors"/>
            <div class="flex flex-row justify-between w-2/3">
                <Link 
                    class="font-medium hover:font-light transition-all"
                    href="/login/forgotten-password" 
                    prefetch={false}>
                    Mot de passe oublié
                </Link>
                <Link 
                    class="font-medium hover:font-light transition-all"
                    href="/login/register"
                    prefetch={false}>
                    S'enregistrer
                </Link>
            </div>
            {
                login.value && login.value.failed
                ? <pre style="font-family: inherit;" 
                    class="w-2/3 p-2 border-2 rounded border-red-200 
                    bg-red-100 whitespace-pre-wrap">
                    {
                        login.value.message
                        ? login.value.message
                        : null // à finir
                    }
                </pre>
                : null
            }
        </Form>
    </div>
})

export const head: DocumentHead = {
    frontmatter: {
        header: false
    }
}