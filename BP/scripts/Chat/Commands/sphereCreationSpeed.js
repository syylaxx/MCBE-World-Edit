import { world } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender: player } = eventData

    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    if (!message.toLowerCase().startsWith(prefix + "spherecreationspeed"))
        return

    eventData.cancel = true

    const sphereCreationSpeed = world.getDynamicProperty("WorldEdit:SphereCreationSpeed")

    if (message.toLowerCase() === (prefix + "spherecreationspeed"))
        return player.sendMessage("§l§8 » §r§7You can setup the Speed of Blocks Per Tick in Creating a Sphere.\n§l§8 » §r§7Current Speed : §e" + sphereCreationSpeed + "§7 Blocks Per Tick")

    const [ command, value ] = message.split(/\s+/)

    if (message.split(/\s+/).length !== 2)
        return player.sendMessage("§l§8 » §r§7Command was incorrectly built!\n§l§8 » §r§e" + prefix + "sphereCreationSpeed <number>")

    if (!/^[0-9]+$/.test(value))
        return player.sendMessage("§l§8 » §r§7Value needs to be a whole Number!")

    world.setDynamicProperty("WorldEdit:SphereCreationSpeed", value)
    player.sendMessage("§l§8 » §r§7Sphere Creation Speed was changed to : §e" + value)
})
