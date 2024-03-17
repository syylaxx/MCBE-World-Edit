import { world, Vector, BlockPermutation, system } from "@minecraft/server"

/**
 * 
 * @param {Vector} coordinate
 * @param {number} radius 
 * @param {string} blockType 
 */

function createSphere(coordinate, radius, blockType, player) {
    const { x: centerX, y: centerY, z: centerZ } = coordinate;

    const maxBlocksPerInterval = world.getDynamicProperty("WorldEdit:SphereCreationSpeed")
    const delayBetweenIntervals = 1; // Opóźnienie między kolejnymi interwałami (w tickach)

    let xIndex = centerX - radius;
    let yIndex = centerY - radius;
    let zIndex = centerZ - radius;

    const run = system.runInterval(() => {
        for (let i = 0; i < maxBlocksPerInterval; i++) {
            if (xIndex <= centerX + radius && yIndex <= centerY + radius && zIndex <= centerZ + radius) {
                const distance = Math.sqrt(Math.pow(xIndex - centerX, 2) + Math.pow(yIndex - centerY, 2) + Math.pow(zIndex - centerZ, 2));
                if (distance <= radius) {
                    const vector = new Vector(xIndex, yIndex, zIndex);
                    try {
                        //world.getDimension('overworld').getBlock(vector).setPermutation(BlockPermutation.resolve(blockType));
                        world.getDimension('overworld').fillBlocks(vector, vector, blockType)
                    } catch (error) {
                        player.sendMessage("§l§8 » §r§7Creating Sphere failed! Wrong typeID or out of World!§r");
                        
                        system.clearRun(run);
                        return;
                    }
                }

                zIndex++;
                if (zIndex > centerZ + radius) {
                    zIndex = centerZ - radius;
                    yIndex++;
                }
                if (yIndex > centerY + radius) {
                    yIndex = centerY - radius;
                    xIndex++;
                }
            } else {
                player.sendMessage("§l§8 » §r§7Successfully Created a Sphere!§r");
                system.clearRun(run);
                return;
            }
        }
    }, delayBetweenIntervals);
}

/**
 * @param {Player} player
 * @param {string[]} messageParts
 */

function sphere(player, messageParts) {
    const coordinate1 = player.getDynamicProperty("WorldEdit:Coordinate1")
    const coordinate2 = player.getDynamicProperty("WorldEdit:Coordinate2")

    if (coordinate1 === undefined) {
        player.sendMessage("§l§8 » §r§7To execute this Command you need atleast One Saved Block!§r")
        return
    }

    let coordinate

    switch (coordinate2) {
        case undefined:
            coordinate = coordinate1
            break
        default:
            coordinate = coordinate2
    }

    let sphereID = messageParts[1]

    if (!sphereID.startsWith("minecraft:")) 
        sphereID = "minecraft:" + messageParts[1]

    const r = messageParts[2]
    
    try {
        createSphere(coordinate, Number(r), sphereID, player)
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

    eventData.cancel = true

    if (message.toLowerCase() === (prefix + "sphere"))
        return sender.sendMessage("§l§8 » §r§7Command was incorrect!\n§l§8 » §r§7 " + prefix + "sphere <typeID> <radius>§r")

    sphere(sender, message.split(" "))
})

world.afterEvents.worldInitialize.subscribe(() => {
    if (world.getDynamicProperty("WorldEdit:SphereCreationSpeed"))
        return

    world.setDynamicProperty("WorldEdit:SphereCreationSpeed", 1500)
})
