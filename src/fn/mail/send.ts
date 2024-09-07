import type { RequestEvent, RequestEventAction, RequestEventBase } from "@builder.io/qwik-city";

type MailOptions = {
    requestEvent: RequestEvent | RequestEventAction | RequestEventBase,
    to: string,
    subject: string,
    body: string,
    name?: string,
    from?: string,
    reply?: string
}

type MailResponse = {
    success: boolean
}

export default async function(opt: MailOptions) {
    const token = opt.requestEvent.env.get("MAIL_TOKEN")
    if(!token) throw new Error('env variable MAIL_TOKEN not found')

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            to: opt.to,
            subject: opt.subject,
            body: opt.body,
            name: opt.name,
            from: opt.from
        })
    };
          
    const response = await fetch('https://api.useplunk.com/v1/send', options);
    const json: MailResponse = await response.json()
    
    return json;
}