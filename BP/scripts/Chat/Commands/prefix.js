import { world } from "@minecraft/server"

world.afterEvents.playerJoin.subscribe(() => {
    if (world.getDynamicProperty("WorldEdit:Prefix") === undefined) {
        world.setDynamicProperty("WorldEdit:Prefix", "?")
    }
})

world.beforeEvents.chatSend.subscribe((eventData) => {
    let { message, sender } = eventData
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    message = message.toLowerCase()

    if (!message.startsWith(prefix + "prefix"))
        return

    eventData.cancel = true

    if (message === prefix + "prefix") {
        sender.sendMessage("§l§8 » §r§7Proper usage : '" + prefix + "prefix' <prefix>§r")
    }

    const newPrefix = message.split(" ")[1]

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