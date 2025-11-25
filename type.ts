export
type I_role = 'system' | 'user' | 'assistant'

export
interface I_msg {
    role: I_role
    content: string
}
