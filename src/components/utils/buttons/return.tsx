import { component$, PropsOf } from "@builder.io/qwik";

import { Link } from "@builder.io/qwik-city";
import Arrow from "~/components/contents/ui/arrow.svg?jsx"

interface ReturnButton extends PropsOf<'a'> {
    href?: string 
    text?: string
}

export default component$(({ href, text, ...props}: ReturnButton) => {
    return <Link 
        href={ href || '/' }
        class={[
            props.class,
            "flex flex-row gap-1 p-2 w-fit h-fit rounded hover:bg-zinc-300 transition-colors"
        ]} 
        {...props}>
        <Arrow class="rotate-180" />
        <div>{ text || 'Revenir en arrière' }</div>
    </Link>
})