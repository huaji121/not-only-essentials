import {
  Container,
  Entity,
  EntityComponentTypes,
  EquipmentSlot,
  GameMode,
  ItemStack,
  Player,
  system,
} from "@minecraft/server";
import { DynamicJson } from "./DynamicJson";

export function getPlayerMainHandItem(player: Player) {
  return player.getComponent(EntityComponentTypes.Inventory)?.container.getItem(player.selectedSlotIndex);
}

export function setPlayerMainHandItem(player: Player, item?: ItemStack) {
  player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, item);
}

export function getPlayerOffhandItem(player: Entity): ItemStack | undefined {
  const equip = player.getComponent("minecraft:equippable");
  if (!equip) return undefined;

  return equip.getEquipment(EquipmentSlot.Offhand) ?? undefined;
}

export function setPlayerOffhandItem(player: Player, item?: ItemStack) {
  player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Offhand, item);
}

export function updatePlayerOnHandItemDynamicJson<T>(
  player: Player,
  item: ItemStack,
  itemJson: DynamicJson<T>,
  changedItemObj: T
) {
  itemJson.set(changedItemObj);
  setPlayerMainHandItem(player, item);
}

// export function getInventoryItemCount(container: Container, expectedItemId: string) {
//   let count = 0;
//   for (let i = 0; i < container.size; i++) {
//     const item = container.getItem(i);
//     if (item === undefined) continue;
//     const amount = item.amount;
//     const itemId = item.typeId;
//     if (itemId === expectedItemId) {
//       count += amount;
//     }
//   }
//   return count;
// }

export function getInventoryItemCount(player: Entity, itemId: string): number {
  const inv = player.getComponent("minecraft:inventory")?.container;
  if (!inv) return 0;

  let total = 0;
  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (item && item.typeId === itemId) {
      total += item.amount;
    }
  }
  return total;
}

export interface RequiredItemEntry {
  id: string;
  amount: number;
}

/**
 * @returns 被“使用”的物品 id；失败返回 undefined
 */
export function consumeMultiple(player: Player, entries: RequiredItemEntry[]): string | undefined {
  if (entries.length === 0) return undefined;

  const isCreative = player.getGameMode() === GameMode.Creative;

  /* ---------- 0️⃣ 根据副手重排尝试顺序 ---------- */
  let orderedEntries = entries;
  const offhandItem = getPlayerOffhandItem(player);

  if (offhandItem) {
    const idx = entries.findIndex((e) => e.id === offhandItem.typeId);
    if (idx !== -1) {
      // 把“副手对应的 entry”提到最前
      orderedEntries = [entries[idx], ...entries.slice(0, idx), ...entries.slice(idx + 1)];
    }
  }

  /* ---------- 1️⃣ OR 语义逐个尝试 ---------- */
  for (const { id, amount } of orderedEntries) {
    // 不需要消耗，直接成功
    if (amount <= 0) {
      return id;
    }

    const offhandCount = offhandItem && offhandItem.typeId === id ? offhandItem.amount : 0;

    const invCount = getInventoryItemCount(player, id);

    if (offhandCount + invCount < amount) {
      continue;
    }

    // 创造模式：不消耗，只决定“使用了哪个 id”
    if (isCreative) {
      return id;
    }

    let remaining = amount;

    /* ---------- 2️⃣ 副手优先消耗 ---------- */
    if (offhandCount > 0) {
      const equip = player.getComponent("minecraft:equippable")!;

      if (offhandCount > remaining) {
        offhandItem!.amount = offhandCount - remaining;
        equip.setEquipment(EquipmentSlot.Offhand, offhandItem!);
        return id;
      } else {
        equip.setEquipment(EquipmentSlot.Offhand, undefined);
        remaining -= offhandCount;
      }
    }

    // /* ---------- 3️⃣ 背包 clear ---------- */

    system.run(() => {
      player.runCommand(`clear @s ${id} 0 ${remaining}`);
    });

    return id;
  }

  /* ---------- 2️⃣ 无任何匹配：仅创造模式使用默认 ---------- */
  if (isCreative) {
    return entries[0].id;
  }

  return undefined;
}
