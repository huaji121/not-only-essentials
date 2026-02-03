import { Container, EntityComponentTypes, EquipmentSlot, GameMode, ItemStack, Player } from "@minecraft/server";
import { DynamicJson } from "./DynamicJson";

export function getPlayerOnHandItem(player: Player) {
  return player.getComponent(EntityComponentTypes.Inventory)?.container.getItem(player.selectedSlotIndex);
}

export function setPlayerMainHandItem(player: Player, item?: ItemStack) {
  player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, item);
}

export function getPlayerOffhandItem(player: Player) {
  return player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Offhand);
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

export function getContainerItemCount(container: Container, expectedItemId: string) {
  let count = 0;
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (item === undefined) continue;
    const amount = item.amount;
    const itemId = item.typeId;
    if (itemId === expectedItemId) {
      count += amount;
    }
  }
  return count;
}

interface RequiredItem {
  itemId: string;
  amount: number;
}

export function tryToSpendItem(
  player: Player,
  requiredItems: RequiredItem[],
  failure: () => void,
  success: (itemType: string) => void
) {
  const gameMode = player.getGameMode();
  const inventory = player.getComponent(EntityComponentTypes.Inventory)?.container;
  if (!inventory) return;

  /**副手物品优先 */
  const offHandItem = getPlayerOffhandItem(player);
  if (offHandItem !== undefined) {
    for (let requiredItem of requiredItems) {
      /**物品符合要求 */
      if (offHandItem.typeId === requiredItem.itemId) {
        if (gameMode === GameMode.Creative || offHandItem.amount >= requiredItem.amount) {
          /**非创造模式消耗弹药 */
          if (gameMode !== GameMode.Creative) {
            // player.runCommand(`clear @s ${requiredItem.itemId} 0 ${requiredItem.amount}`);
            if (offHandItem.amount - requiredItem.amount <= 0) {
              setPlayerOffhandItem(player, undefined);
            } else {
              offHandItem.amount -= requiredItem.amount;
              setPlayerOffhandItem(player, offHandItem);
            }
          }
          success(requiredItem.itemId);
          return;
        }
        /**不进行失败 去判断背包内 */
      }
    }
  }

  /**验证所有弹药类型存在其中一个 */
  for (let requiredItem of requiredItems) {
    /**数量判断 */
    if (
      gameMode === GameMode.Creative ||
      getContainerItemCount(inventory, requiredItem.itemId) >= requiredItem.amount
    ) {
      /**非创造模式消耗弹药 */
      if (gameMode !== GameMode.Creative) {
        player.runCommand(`clear @s ${requiredItem.itemId} 0 ${requiredItem.amount}`);
      }

      success(requiredItem.itemId);
      return;
    }
  }

  failure();
}
