import { EntityComponentTypes, ItemComponentUseEvent, ItemCustomComponent, ItemStack } from "@minecraft/server";
import { formatVector3 } from "./utils/tools";

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

    convertedTo.setLore([`§aTeleports you to location §6${formatVector3(player.location)} §awhen used.`]);

    player.dimension.playSound("beacon.activate", player.location);
    player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, convertedTo);
  }
}
