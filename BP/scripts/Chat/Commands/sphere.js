import { world, Vector } from "@minecraft/server"

/**
 * @param {number} radius
 * @param {Vector} vector
 */

function sphere(radius, vector) {

}

/**
 * @param {Player} player
 * @param {string[]} messageParts
 */

function createSphere(player, messageParts) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate1")

    if (coordinate1 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need atleast One Saved Block!§r")
        return
    }

    const coordinates1 = coordinate1.x + " " + coordinate1.y + " " + coordinate1.z
    const coordinates2 = coordinate2.x + " " + coordinate2.y + " " + coordinate2.z

    let coordinate

    switch (coordinate2) {
        case undefined:
            coordinate = coordinate1
            break
        default:
            coordinate = coordinate2
    }

    try {
        sphere(r, coordinate)
        player.sendMessage("§l§8 » §r§7Successfully Created a Sphere!§r")
    } catch (error) {
        player.sendMessage("§l§8 » §r§7Creating Sphere failed! It can be Too Big or out of World!§r")
    }

    player.setDynamicProperty("WorldEdit:Coordinate1", undefined)
    player.setDynamicProperty("WorldEdit:Coordinate2", undefined)
}

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "sphere "))
        return

    createSphere(sender, message.split(" "))
})