import { world, Player } from "@minecraft/server"

/**
 * @param {Player} player
 * @param {string[]} messageParts
 */

function paste(player, messageParts) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")

    const coordinates1 = coordinate1.x + " " + coordinate1.y + " " + coordinate1.z

    if (coordinate1 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need atleast One Saved Block!§r")
        return
    }

    if (messageParts[1] === undefined)
        try {
            world.getDimension("overworld").runCommandAsync(`structure load "` + player.id + `" ` + coordinates1)
            player.sendMessage("§l§8 » §r§7Successfully Pasted Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Pasting Blocks failed! It can be out of World!§r")
        }

    const degreesList = [
        "0",
        "90",
        "180",
        "270"
    ]

    if (degreesList.includes(messageParts[1])) {
        try {
            world.getDimension("overworld").runCommandAsync(`structure load "` + player.id + `" ` + coordinates1 + " " + messageParts[1] + "_degrees")
            player.sendMessage("§l§8 » §r§7Successfully Pasted Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Pasting Blocks failed! It can be out of World!§r")
        }
    }

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "paste "))
        return

    eventData.cancel = true

    paste(sender, message.split(" "))
})