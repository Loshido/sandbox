export const MailConfirm = () => {
    const style = {
        h1: [
            "font-size: 2.25rem",
            "line-height: 2.5rem",
            "font-weight: 900",
            "margin: 0"
        ],
        p: [
            "margin: 4px 0"
        ]
    }
    
    return `<body style="font-family: sans-serif;">
        <h1>
            Confirmation de votre adresse mail Sandbox
        </h1>

        <a href="$$$$$">
            Cliquer ici pour confirmer que votre adresse mail est active.
        </a>

        <p>Notez que notre service n'a pas encore approuvé votre enregistrement</p>

        <p>
            Si vous n'êtes pas à l'origine de cet enregistrement. 
            Vous pouvez simplemement ignorer ce mail, et vous ne recevrez plus de mail.
        </p>

        <footer>
            <h1 style="${style.h1.join(';')}">Sandbox</h1>
            <p style="${style.p.join(';')}">
                Livio Ardoin (<a href="mailto:contact@aruni.space">
                    contact@aruni.space
                </a>)
            </p>
        </footer>
    </body>`
}

export default async (confirmation_ur: string) => {
    const str = MailConfirm()
    str.replace('$$$$$', confirmation_ur)
    return str
}