import { world, system, Player, Vector } from "@minecraft/server"
import "Wrapper/Wrapper.js"

/**
 * @param {Player} player
 */

function clone(player) {
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    const coordinates1 = coordinate1.x + " " + coordinate1.y + " " + coordinate1.z
    const coordinates2 = coordinate2.x + " " + coordinate2.y + " " + coordinate2.z

    if (coordinate1 === undefined || coordinate2 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need Saved Blocks!§r")
        return
    }

    console.warn(`structure save "` + player.id + `" ` + coordinates1 + " " + coordinates2 + " false memory true")

    system.run(() => {
        try {
            player.runCommand(`structure save "` + player.id + `" ` + coordinates1 + " " + coordinates2 + " false memory true")
            player.sendMessage("§l§8 » §r§7Successfully Copied Blocks!§r")
        } catch (error) {
            player.sendMessage("§l§8 » §r§7Copying Blocks failed! It can be too big!§r")
        }
    })

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (message.toLowerCase() !== prefix + "copy")
        return

    eventData.cancel = true

    clone(sender)
})