import { I_msg } from './type.ts'

type I_make_client_stream = (opts: {
    api_key: string
    base_url: string
}) => (model: string) => (msg_list: I_msg[]) =>
    Promise<[null, ReadableStream]
        | ['http error', Response]
        | ['unknown error', string]
    >

export
const make_client__stream: I_make_client_stream = opts => model => async msg_list => {
    const response = await fetch(`${opts.base_url}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${opts.api_key}`,
        },
        body: JSON.stringify({
            model,
            stream: true,
            messages: msg_list,
        }),
    })
    if (!response.ok)
        return ['http error', response]
    if (response.body === null)
        return ['unknown error', 'response body is null']
    return [null, response.body]
}
