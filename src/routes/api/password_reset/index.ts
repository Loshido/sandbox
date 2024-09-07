import { type RequestHandler } from '@builder.io/qwik-city';
 
export const onGet: RequestHandler = async ({ url, json }) => {
    console.log(url.searchParams.get('token'))
    json(200, url.searchParams.get('token'))
};