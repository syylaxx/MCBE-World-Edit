import { world, system, Vector } from "@minecraft/server"
import "Wrapper/Wrapper.js"

function setCoordinates(vector, player) {
    const prefix = world.getDynamicProperty("WorldEdit:Prefix")

    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    if (coordinate1 === undefined && coordinate2 === undefined) {
        player.setDynamicProperty("WorldEdit:Coordinate1", vector)

        const coordinates1 = vector.x + " " + vector.y + " " + vector.z

        player.sendMessage("§l§8 » §r§7Block §e" + coordinates1 + "§7 saved!§r")
    } else if (coordinate1 !== undefined && coordinate2 === undefined) {
        player.setDynamicProperty("WorldEdit:Coordinate2", vector)

        const coordinates2 = vector.x + " " + vector.y + " " + vector.z

        player.sendMessage("§l§8 » §r§7Block §e" + coordinates2 + "§7 saved!§r")
    } else if (coordinate1 !== undefined && coordinate2 !== undefined) {
        player.sendMessage("§l§8 » §r§7Type '" + prefix + "cancel' or Use any World-Edit Command!")
    }
}

world.afterEvents.playerSpawn.subscribe((eventData) => {
    if (!eventData.initialSpawn) {
        eventData.player.setDynamicProperty("WorldEdit:BlockSaveTimeout", 0)
    }
})

world.beforeEvents.playerBreakBlock.subscribe((eventData) => {
    const { itemStack, block, player } = eventData

    if (itemStack?.typeId !== "world-edit:axe")
        return

    eventData.cancel = true

    if (player.getDynamicProperty("WorldEdit:BlockSaveTimeout") !== 0)
        return

    player.setDynamicProperty("WorldEdit:BlockSaveTimeout", 5)

    setCoordinates(block.location, player)
})

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.getDynamicProperty("WorldEdit:BlockSaveTimeout") === 0)
            return

        try {
            player.setDynamicProperty("WorldEdit:BlockSaveTimeout", player.getDynamicProperty("WorldEdit:BlockSaveTimeout") - 1)
        } catch (error) {
            player.setDynamicProperty("WorldEdit:BlockSaveTimeout", 0)
        }
    }
}, 1)