import {
  EntityComponentTypes,
  ItemComponentUseEvent,
  ItemCustomComponent,
  ItemStack,
  system,
  Vector3,
  world,
} from "@minecraft/server";

import { MinecraftItemTypes } from "@minecraft/vanilla-data";

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

    // system.run(() => player.runCommand("playsound beacon.deactivate"));

    player.teleport(pos, { dimension: dim });

    player
      .getComponent(EntityComponentTypes.Inventory)
      ?.container.setItem(player.selectedSlotIndex, new ItemStack(MinecraftItemTypes.Paper, 1));

    // 我声音呢？？等待修复
    // system.run(() => player.runCommand("playsound beacon.deactivate"));
    // player.playSound("beacon.deactivate");
  }
}
