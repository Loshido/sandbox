import { component$, useStore } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";

import Return from "~/components/utils/buttons/return"

import _try from "~/fn/try";
import redis from "~/db/redis";
import postgres from "~/db/sql"
import hash from "~/fn/hash";
export const useRegister = routeAction$(async (data, requestEvent) => {
    const volatile = await redis(requestEvent)
    if(!volatile.isOpen || !(await volatile.get("registering"))) {
        return {
            type: "failed",
            message: "⚠️ L'enregistrement n'est pas ouvert."
        }
    }

    const password = hash(data.password, requestEvent)
    const sql = postgres(requestEvent)
    const [ response, error ] = await _try(async () => {
        return await sql`INSERT INTO users
            ${ sql({
                email: data.email,
                password
            }, "email", "password") }
            RETURNING *;`
    })
    if(response) return {
        type: "success",
        message: "L'enregistrement a été déposé."
    }
    else return {
        type: "failed",
        //@ts-ignore
        message: '⚠️ ' + error.detail
    }
}, zod$({
    email: z.string()
        .email("L'adresse email ne convient pas.")
        .min(6, "L'adresse email doit contenir plus de 6 caractères."),
    password: z.string()
        .min(6, "Le mot de passe doit contenir plus de 6 caractères."),
    confirmation: z.string()
        .min(6, '')
}))

export default component$(() => {
    const register = useRegister()
    const values = useStore({
        email: "",
        password: "",
        confirmation: ""
    })

    return <div 
        class="xl:p-12 p-4 grid gap-2
        backdrop-blur-sm bg-white bg-opacity-25 h-screen" 
        style="grid-template-rows: auto 1fr">
        <Return href="/login/" text="Revenir à la page de connexion" />
        <Form 
            action={register}
            class="flex flex-col gap-4 py-4 items-center justify-center">

            <label class="md:w-2/3 w-5/6 flex flex-col ">
                <input 
                    name="email" value={values.email}
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

            <label class="md:w-2/3 w-5/6 flex flex-col">
                <input 
                    name="password" value={values.password}
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

            <label class="md:w-2/3 w-5/6 flex flex-col">
                <input 
                    name="confirmation" value={values.confirmation}
                    onInput$={(_, el) => values.confirmation = el.value}
                    type="password" id="confirmation"
                    placeholder="Confirmer votre mot de passe"
                    class={[
                        "p-3 text-xl border-2 rounded w-full",
                        values.confirmation === values.password ? 'border-zinc-200' : 'border-red-200'
                    ]} />
                {
                    values.confirmation !== values.password
                    ? <span class="py-1 font-thin text-sm">
                        Le mot de passe de confirmaton n'est pas le même que votre mot de passe.
                    </span> 
                    : null
                }
            </label>
            <input 
                disabled={
                    values.confirmation !== values.password
                    || values.password.length < 6
                    || values.email.length < 6
                    || register.value?.type === "success"
                }
                type="submit" value="Demander la création de votre compte"
                class="p-3 text-xl border-2 border-zinc-500 rounded md:w-2/3 w-5/6
                    bg-zinc-700 text-white disabled:bg-zinc-400
                    disabled:border-zinc-100 transition-colors"/>
            <p class="md:w-2/3 w-5/6">
                Une fois votre demande faite, 
                vous recevrez une demande de confirmation par email,
                sous réserve que votre demande soit acceptée
            </p>
            {
                register.value
                ? (
                    register.value.failed
                    ? register.value.formErrors.join(" ")
                    : <pre style="font-family: inherit;" 
                        class={[
                            "md:w-2/3 w-5/6 p-2 border-2 rounded",
                            register.value.type === "failed" 
                            ? 'border-red-200 bg-red-100'
                            : 'border-zinc-200 bg-zinc-200' 
                        ]}>
                        {register.value.message}
                    </pre>
                )
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