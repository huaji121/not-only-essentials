import { EntityComponentTypes, ItemComponentUseEvent, ItemCustomComponent, ItemStack, world } from "@minecraft/server";
import { MOD_ID } from "../ModID";
import { formatDimension, formatVector3 } from "../utils/tools";

export class EnderScrollUnusedComponent implements ItemCustomComponent {
  onUse(event: ItemComponentUseEvent): void {
    const player = event.source;
    const convertedTo = new ItemStack(MOD_ID.of("ender_scroll"), 1);

    convertedTo.setDynamicProperties({
      pos: player.location,
      dim: player.dimension.id,
    });

    convertedTo.setLore([
      `§a使用后将你传送到§e${formatDimension(player.dimension.id)}§6${formatVector3(player.location)}`,
    ]);

    player.dimension.playSound("beacon.activate", player.location);
    player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, convertedTo);
  }
}
