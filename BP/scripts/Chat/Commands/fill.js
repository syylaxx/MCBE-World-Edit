import { world, system, Vector } from "@minecraft/server"
import "Wrapper/Wrapper.js"

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = sender.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = sender.getDynamicProperty("WorldEdit:Coordinate2")

    if (!message.toLowerCase().startsWith(prefix + "fill"))
        return

    eventData.cancel = true

    if (coordinate1 === undefined || coordinate2 === undefined) {
        sender.sendMessage("§l§8 » §r§7To execute this Command you need Saved Blocks!§r")
        return
    }
    system.run(() => {
        try {
            world.getDimension("overworld").fillBlocks(coordinate1, coordinate2, message.split(prefix + "fill ")[1])
            sender.sendMessage("§l§8 » §r§7Successfully placed Blocks!§r")
        } catch (error) {
            sender.sendMessage("§l§8 » §r§7Placing Blocks failed! It can be too big or Out of the World!§r")
        }
    })

    sender.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    sender.setDynamicProperty("WorldEdit:Coordinate2", undefined)
})