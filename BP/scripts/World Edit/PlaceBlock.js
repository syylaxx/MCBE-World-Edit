import { world, system, Vector } from "@minecraft/server"

world.beforeEvents.itemUse.subscribe((eventData) => {
    const { source, itemStack } = eventData

    if (itemStack?.typeId !== "world-edit:axe")
        return

    if (!source.isFlying && !source.isFalling)
        return

    system.run(() => {
        try {
            world.getDimension("overworld").fillBlocks(new Vector(source.location.x, source.location.y - 1, source.location.z), new Vector(source.location.x, source.location.y - 1, source.location.z), "minecraft:bedrock")
            source.sendMessage("§l§8 » §r§7Successfully placed Block!§r")
        } catch (error) {
            source.sendMessage("§l§8 » §r§7Placing Block failed! It can be Out of the World or wrong TypeID!§r")
        }
    })
})