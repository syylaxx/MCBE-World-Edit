import { world } from "@minecraft/server"

const helpCommandText = [
    ""
]

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "help"))
        return

    eventData.cancel = true

    sender.sendMessage(helpCommandText)
})