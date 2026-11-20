import { useState } from "preact/hooks"

export type Props = {
    content: string[]
}

export function Terminal({ content }: Props) {
    const [history, setHistory] = useState<string[]>(content)
    return <div className="w-full">{history.map(line => <pre className="text-black">{line}</pre>)}</div>
}