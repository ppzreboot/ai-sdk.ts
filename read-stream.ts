type I_stream_item = [null, string]
  | ['error on parse json', Error]
  | ['error on invalid content', unknown]

export
async function *read_stream(body: ReadableStream): AsyncGenerator<I_stream_item, null, void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  while(true) {
    const chunk = await reader.read()
    const chunk_str = decoder.decode(chunk.value)
    if (chunk.done)
      return null

    const lines = chunk_str.split('\n')

    for (let line of lines) {
      line = line.trim()
      if (line.length === 0)
        continue
      else if (line === 'data: [DONE]')
        // return null
        continue // 必须 read 出 done 才行

      const parsed = parse_json(line.slice(6))
      if (parsed instanceof Error)
        yield ['error on parse json', parsed]
      else {
        // @ts-ignore:
        const content = parsed?.choices?.[0]?.delta?.content
        if (typeof(content) === 'string')
          yield [null, content]
        else
          yield ['error on invalid content', parsed]
      }
    }
  }
}

function parse_json(source: string) {
  try {
    return JSON.parse(source)
  } catch(err) {
    return err
  }
}
