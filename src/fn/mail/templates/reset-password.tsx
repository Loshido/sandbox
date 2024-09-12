export const PasswordReset = () => {
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
            Réinitialiser votre mot de passe Sandbox
        </h1>

        <a href="$$$$$">
            Cliquer ici pour réinitialiser votre mot de passe
        </a>

        <p>
            Si vous n'avez pas demander une réinitialisation. 
            Vous pouvez simplemement ignorer ce mail.
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

export default (reset_url: string) => {
    const str = PasswordReset()
    str.replace('$$$$$', reset_url)
    return str
}