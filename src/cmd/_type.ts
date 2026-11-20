export type Command = {
    name: string
    aliases: string[]
    description: string
    function: (args: string[]) => string[]
}

export class CommandRegister {
    commands: Command[] = []
    register(command: Command) {
        this.commands.push(command)
    }
    run(cmd: string, args: string[]) {
        const command = this.commands.find(c => c.name === cmd || c.aliases.includes(cmd))
    }
}