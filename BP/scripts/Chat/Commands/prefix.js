import { world } from "@minecraft/server"
import "Wrapper/Wrapper.js"

world.afterEvents.playerJoin.subscribe((eventData) => {
    newDynamicPorperty(world, "WorldEdit:Prefix", "?")
})

world.beforeEvents.chatSend.subscribe((eventData) => {
    let { message, sender } = eventData
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "prefix"))
        return

    eventData.cancel = true

    if (message.toLowerCase() === prefix + "prefix") {
        sender.sendMessage("§l§8 » §r§7Proper usage : '" + prefix + "prefix' <prefix>§r")
    }

    message = message.toLowerCase()

    const newPrefix = message.split(prefix + "prefix ")[1]

    if (newPrefix === "") {
        sender.sendMessage("§l§8 » §r§7This Prefix is not Valid!§r")
    } else if (newPrefix.includes(" ")) {
        sender.sendMessage("§l§8 » §r§7Prefix cannot contain spaces!§r")
    } else if (newPrefix === prefix) {
        sender.sendMessage("§l§8 » §r§7This Prefix is already set!§r")
    } else {
        sender.sendMessage("§l§8 » §r§7New Prefix Set to : §b" + newPrefix + "§r")
        world.setDynamicProperty("WorldEdit:Prefix", newPrefix)
    }
})