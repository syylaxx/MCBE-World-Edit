import { world } from "@minecraft/server"

function newDynamicPorperty(object, dynamicProperty, value) {
    if (object.getDynamicProperty(dynamicProperty) === undefined) {
        object.setDynamicProperty(dynamicProperty, value)
    }
}