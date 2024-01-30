import { world, system, BlockPermutation } from "@minecraft/server"
import "Wrapper/Wrapper.js"

function setBlocks(sender, message) {
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = sender.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = sender.getDynamicProperty("WorldEdit:Coordinate2")

    if (coordinate1 === undefined || coordinate2 === undefined) {
        sender.sendMessage("§l§8 » §r§7To execute this Command you need Saved Blocks!§r")
        return
    }
    system.run(() => {
        try {
            world.getDimension("overworld").fillBlocks(coordinate1, coordinate2, message.split(prefix + "fill ")[1])
            sender.sendMessage("§l§8 » §r§7Successfully placed Blocks!§r")
        } catch (error) {
            sender.sendMessage("§l§8 » §r§7Placing Blocks failed! It can be too big, Out of the World or wrong TypeID!§r")
        }
    })

    sender.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    sender.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

function replaceBlocks(player, message) {
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    const subcommand = message.split(" ")[1]

    const replaceID = message.split(prefix + "fill ")[1].split(" ")[2]

    if (coordinate1 === undefined || coordinate2 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need Saved Blocks!§r")
        return
    }

    system.run(() => {
        try {
            world.getDimension("overworld").fillBlocks(coordinate1, coordinate2, subcommand, { matchingBlock: BlockPermutation.resolve(replaceID) })
            player.sendMessage("§l§8 » §r§7Successfully placed Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Placing Blocks failed! It can be too big, Out of the World or wrong TypeID!§r")
        }
    })

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "fill"))
        return

    eventData.cancel = true

    const subcommand = message.split(prefix + "fill ")[1].split(" ")[1]

    if (subcommand?.toLowerCase() !== "replace") {
        setBlocks(sender, message)
    } else {
        replaceBlocks(sender, message)
    }
})