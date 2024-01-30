import { world, system, Vector } from "@minecraft/server"
import "Wrapper/Wrapper.js"

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = sender.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = sender.getDynamicProperty("WorldEdit:Coordinate2")

    if (message.toLowerCase() !== prefix + "cancel")
        return

    eventData.cancel = true

    if (coordinate1 === undefined && coordinate2 === undefined) {
        sender.sendMessage("§l§8 » §r§7You have no Blocks chosen!§r")
    } else {
        sender.sendMessage("§l§8 » §r§7All saved Blocks deleted!§r")
        sender.setDynamicProperty("WorldEdit:Coordinate1", undefined)
        sender.setDynamicProperty("WorldEdit:Coordinate2", undefined)
    }
})