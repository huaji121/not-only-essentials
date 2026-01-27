import {
  EntityComponentTypes,
  ItemComponentUseEvent,
  ItemCustomComponent,
  ItemStack,
  Vector3,
  world,
} from "@minecraft/server";

export class EnderScrollComponent implements ItemCustomComponent {
  onUse(event: ItemComponentUseEvent): void {
    const player = event.source;
    const item = event.itemStack;
    const pos = {
      x: <number>item?.getDynamicProperty("pos_x") ?? 0,
      y: <number>item?.getDynamicProperty("pos_y") ?? 0,
      z: <number>item?.getDynamicProperty("pos_z") ?? 0,
    } satisfies Vector3;
    const dim = world.getDimension(<string>item?.getDynamicProperty("dim") ?? "overworld");
    player.teleport(pos, { dimension: dim });

    player
      .getComponent(EntityComponentTypes.Inventory)
      ?.container.setItem(player.selectedSlotIndex, new ItemStack("minecraft:paper", 1));
  }
}
