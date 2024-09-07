import { component$, useStore } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";

import Return from "~/components/utils/buttons/return"

import _try from "~/fn/try";
import postgres from "~/db/sql"
export const useRequestPasswordChange = routeAction$(async (data, requestEvent) => {
    const sql = postgres(requestEvent)

    // const [ response, error ] = await _try(async () => {
    //     return await sql`SELECT 1
    //         FROM users
    //         WHERE email = ${data.email};`
    // })

    // if(response.count === 1) {
    //     Envoyer un email avec usePlunk
    //}

    return {
        message: "Vous allez recevoir un email pour réinitialiser votre mot de passe"
    }

}, zod$({
    email: z.string()
        .email("L'adresse email ne convient pas.")
        .min(6, "L'adresse email doit contenir plus de 6 caractères.")
}))

export default component$(() => {
    const requestPasswordChange = useRequestPasswordChange()
    const value = useStore({
        email: ''
    })

    return <div class="p-12 grid gap-2" style="grid-template-rows: auto 1fr">
        <Return href="/login/" text="Revenir à la page de connexion" />
        <Form 
            action={requestPasswordChange}
            class="flex flex-col gap-4 py-4 items-center justify-center">
             <label class="w-2/3 flex flex-col">
                <input 
                    name="email"
                    onInput$={(_, el) => value.email = el.value}
                    type="email" id="email"
                    placeholder="votre@adresse.email"
                    class={[
                        "p-3 text-xl border-2 rounded w-full",
                        value.email.length < 6 ? 'border-red-200' : 'border-zinc-200'
                    ]} />
                    {
                        value.email.length < 6
                        ? <span class="py-1 font-thin text-sm">
                            Votre adress email doit contenir plus de 6 caractères.
                        </span>
                        : null
                    }
             </label>
            <input 
                disabled={value.email.length < 6}
                type="submit" value="Demander à réinitialiser le mot de passe"
                class="p-3 text-xl border-2 border-zinc-500 rounded w-2/3
                    bg-zinc-700 text-white disabled:bg-zinc-400
                    disabled:border-zinc-100 transition-colors"/>

            {
                requestPasswordChange.value?.message
                ? <pre style="font-family: inherit;" 
                    class="w-2/3 p-2 border-2 rounded border-zinc-200 
                    bg-zinc-100 whitespace-pre-wrap">
                    {requestPasswordChange.value?.message}
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