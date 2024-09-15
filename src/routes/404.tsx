import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import Whiskers from "~/components/contents/Whiskers.png?jsx"

export default component$(() => {
    return <div id="page-404" class="relative w-full h-full grid justify-items-center content-end">
        <div class="text-center flex flex-col gap-2  items-center">
            <div class="flex items-end">
                <h1 class="text-8xl font-bold">404</h1>
                <div class="text-xl ml-1 flex flex-col items-end">
                    On dirait que vous vous êtes perdu(e) 🕵️
                    <div class="h-1 w-1/4 bg-teal-700 mr-[75%] rounded"/>
                </div>
            </div>
            <Link href="/" 
                class="italic px-2 py-1 font-light hover:bg-teal-600 hover:bg-opacity-10 rounded w-fit
                    transition-colors">
                Revenir sur le droit chemin
            </Link>
        </div>
        <Whiskers class="h-auto w-1/4 inline" />
    </div>
})