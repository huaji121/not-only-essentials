import { EntityComponentTypes, ItemComponentUseEvent, ItemCustomComponent, ItemStack } from "@minecraft/server";
import { formatVector3 } from "./utils";

export class EnderScrollUnusedComponent implements ItemCustomComponent {
  onUse(event: ItemComponentUseEvent): void {
    const player = event.source;
    const convertedTo = new ItemStack("noe:ender_scroll", 1);
    convertedTo.setDynamicProperties({
      pos_x: player.location.x,
      pos_y: player.location.y,
      pos_z: player.location.z,
      dim: player.dimension.id,
    });

    convertedTo.setLore([`§7Teleports you to location §6${formatVector3(player.location)} §7when used.`]);

    player.playSound("beacon.activate");
    player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, convertedTo);
  }
}
