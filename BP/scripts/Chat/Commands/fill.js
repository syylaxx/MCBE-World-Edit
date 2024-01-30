import { world, system, BlockPermutation, Player } from "@minecraft/server"

/**
 * @param {Player} player
 * @param {string} message
 */

function setBlocks(player, message) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    if (coordinate1 === undefined || coordinate2 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need Saved Blocks!§r")
        return
    }

    system.run(() => {
        try {
            world.getDimension("overworld").fillBlocks(coordinate1, coordinate2, message.split(" ")[1])
            player.sendMessage("§l§8 » §r§7Successfully placed Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Placing Blocks failed! It can be too big, Out of the World or wrong TypeID!§r")
        }
    })

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

/**
 * @param {Player} player
 * @param {string} message
 */

function replaceBlocks(player, message) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    const subcommand = message.split(" ")[1]
    const replaceID = message.split(" ")[3]

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

    const subcommand = message.split(" ")[2]

    if (subcommand?.toLowerCase() !== "replace") {
        setBlocks(sender, message)
    } else {
        replaceBlocks(sender, message)
    }
})