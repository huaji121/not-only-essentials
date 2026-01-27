import { EntityComponentTypes, ItemComponentUseEvent, ItemCustomComponent, ItemStack } from "@minecraft/server";

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

    convertedTo.setLore([
      `§7Teleports you to location ${player.location.x}, ${player.location.y}, ${player.location.z} when used.`,
    ]);

    player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, convertedTo);
  }
}
