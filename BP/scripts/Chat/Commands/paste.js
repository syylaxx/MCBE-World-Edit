import { world, Player } from "@minecraft/server"

/**
 * @param {Player} player
 * @param {string[]} messageParts
 */

function paste(player, messageParts) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate1")

    if (coordinate1 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need atleast One Saved Block!§r")
        return
    }

    const coordinates1 = coordinate1.x + " " + coordinate1.y + " " + coordinate1.z
    const coordinates2 = coordinate2.x + " " + coordinate2.y + " " + coordinate2.z

    if (messageParts[1] === undefined) {
        let coordinate

        switch (coordinate2) {
            case undefined:
                coordinate = coordinates1
                break
            default:
                coordinate = coordinates2
        }

        try {
            world.getDimension("overworld").runCommandAsync(`structure load "` + player.id + `" ` + coordinate)
            player.sendMessage("§l§8 » §r§7Successfully Pasted Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Pasting Blocks failed! It can be out of World!§r")
        }
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

    if (!message.toLowerCase().startsWith(prefix + "paste"))
        return

    eventData.cancel = true

    paste(sender, message.split(" "))
})