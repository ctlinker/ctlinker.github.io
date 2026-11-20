import { useEffect, useState } from "preact/hooks"

type Props = {
    content: string
    speed?: number
    className?: string
}

export function TypeWritter({ className, content, speed=50, ...props }: Props) {
    const [current, setCurrent] = useState("")
    
    useEffect(() => {
        let interval: any
        if(current.length < content.length) {
            interval = setInterval(() => {
               const next = content[current.length]
               setCurrent(prev => prev + next)
            }, speed)
        }
        return () => clearInterval(interval)
    }, [current, content, speed])

    return <span className={className} {...props}>{current}</span>
}