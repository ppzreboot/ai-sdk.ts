import { assert } from '@std/assert'
import { make_client__stream } from "./stream.ts";
import { read_stream } from "./read-stream.ts";

Deno.test('stream response', async t => {
    const complete = make_client__stream({
        api_key: Deno.env.get('QWEN_API_KEY')!,
        base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    })('qwen-flash')

    const [error, response_body] = await complete([
        { role: 'user', content: 'hello' }
    ])
    assert(error === null)

    const stream = read_stream(response_body)
    for await(const [err, chunk] of stream) {
        assert(err === null)
        assert(typeof(chunk) === 'string')
    }
    const result = await stream.next()
    assert(result.done === true)
})
