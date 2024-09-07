import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import Fav from "~/components/contents/ico.svg?jsx"

export default component$(() => {
    return <header class="flex flex-row px-64 py-8 justify-between">
        <div class="title text-4xl font-black select-none
            flex flex-row gap-2 items-center">
            {/* <Fav width={16} height={16 } /> */}
            Sandbox
        </div>
        <nav class="flex flex-row gap-2">
            <Link 
                href="/login"
                prefetch={false}
                class="px-4 py-3 bg-zinc-900 text-white hover:bg-zinc-700
                    transition-colors rounded">
                Accéder au tableau de board
            </Link>
        </nav>
    </header>
})