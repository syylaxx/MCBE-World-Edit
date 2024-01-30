import { world, system, Player } from "@minecraft/server"
import "Wrapper/Wrapper.js"

/**
 * @param {Player} player
 */

function paste(player) {
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")

    const coordinates1 = coordinate1.x + " " + coordinate1.y + " " + coordinate1.z

    if (coordinate1 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need atleast One Saved Block!§r")
        return
    }

    system.run(() => {
        try {
            world.getDimension("overworld").runCommand(`structure load "` + player.id + `" ` + coordinates1)
            player.sendMessage("§l§8 » §r§7Successfully Pasted Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Pasting Blocks failed! It can be out of World!§r")
        }
    })

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (message.toLowerCase() !== prefix + "paste")
        return

    eventData.cancel = true

    paste(sender)
})