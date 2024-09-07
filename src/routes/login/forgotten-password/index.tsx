import { component$, useStore } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";

import Return from "~/components/utils/buttons/return"

import _try from "~/fn/try";
import postgres from "~/db/sql"

import send from "~/fn/mail/send";
import toString from "~/fn/mail/toString";
import PasswordReset from "~/fn/mail/templates/reset-password";

type User = { 
    id: number, 
    type: string | null 
}

interface MailService {
    id: number,
    user_id: number,
    type: string,
    token: string,
    createdat: Date
}
export const useRequestPasswordChange = routeAction$(async (data, requestEvent) => {
    const sql = postgres(requestEvent)

    // identification de la demande
    const entries = {
        type: "password-reset"
    }

    const [ response, error ] = await _try(async () => {
        // Prendre toutes les demandes et/ou l'identifiant de l'utilisateur
        const users = await sql<User[]>`SELECT u.id, m.type
            FROM users u
            LEFT JOIN mail_service m ON m.user_id = u.id 
            WHERE u.email = ${data.email} AND u.confirmed = 2 AND m.type = 'password-reset';`;

        // Si aucun utilisateur est trouvé.
        if(users.length === 0) 
            throw new Error(`There is no user with email = ${data.email}`)
        
        // Si le nombre de demandes dépasse 5, on n'envoie pas de mails
        if(users.length >= 5 || !users[0]?.id) 
            return []

        // On ajoute la demande pour la retrouver antérieurement
        const response = 
            await sql<[ MailService ]>`INSERT INTO mail_service ${ sql({
                type: 'password-reset',
                user_id: users[0]?.id
            })} RETURNING *;`;
        return [...response];
    })

    if(response && response.length === 1) {
        // Template prédéfini pour réinitialiser le mot de passe
        const body = await toString(<PasswordReset 
            reset_url={`http://localhost:5173/api/password_reset?token=${response[0].token}`}/>)
        await send({
            to: data.email,
            subject: "Sandbox - Réinitialisation de mot de passe",
            body,
            requestEvent
        })
    }

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

    return <div 
        class="xl:p-12 p-4 grid gap-2 
        backdrop-blur-sm bg-white bg-opacity-25 h-screen" 
        style="grid-template-rows: auto 1fr">
        <Return href="/login/" text="Revenir à la page de connexion" />
        <Form 
            action={requestPasswordChange}
            class="flex flex-col gap-4 py-4 items-center justify-center">
             <label class="md:w-2/3 w-5/6 flex flex-col">
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
                class="p-3 text-xl border-2 border-zinc-500 rounded md:w-2/3 w-5/6
                    bg-zinc-700 text-white disabled:bg-zinc-400
                    disabled:border-zinc-100 transition-colors"/>

            {
                requestPasswordChange.value?.message
                ? <pre style="font-family: inherit;" 
                    class="md:w-2/3 w-5/6 p-2 border-2 rounded border-zinc-200 
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