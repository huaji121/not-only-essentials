import {
  EffectType,
  Entity,
  EntityComponentTypes,
  EntityEffectOptions,
  GameMode,
  ItemStack,
  Player,
  system,
  Vector3,
} from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import { DynamicJson } from "./DynamicJson";

export function formatVector3(vector: Vector3): string {
  return `(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;
}

export function formatDimension(dimension: string): string {
  switch (dimension) {
    case MinecraftDimensionTypes.Overworld:
      return "主世界";
    case MinecraftDimensionTypes.Nether:
      return "下界";
    case MinecraftDimensionTypes.TheEnd:
      return "末地";
    default:
      return dimension;
  }
}

/**
 * 原版行为级紫颂果传送
 * 支持高空传送到地面
 * @param {Entity} entity
 * @param {number} range
 */
export function chorusTeleport(entity: Entity, range = 8) {
  const dimension = entity.dimension;
  const origin = entity.location;

  const minY = dimension.heightRange.min;
  const maxY = dimension.heightRange.max;

  // 原版：最多 16 次尝试
  for (let attempt = 0; attempt < 16; attempt++) {
    const x = Math.floor(origin.x + (Math.random() * 2 - 1) * range);
    const z = Math.floor(origin.z + (Math.random() * 2 - 1) * range);

    // 起始 Y：原版是“附近的随机高度”
    let y = Math.floor(origin.y + (Math.random() * 2 - 1) * 8);

    // 限制在合法高度内
    y = Math.max(minY + 1, Math.min(maxY - 2, y));

    // 🔥 核心：沿 x,z 向下寻找地面
    for (; y > minY + 1; y--) {
      const blockFeet = dimension.getBlock({ x, y, z });
      const blockHead = dimension.getBlock({ x, y: y + 1, z });
      const blockBelow = dimension.getBlock({ x, y: y - 1, z });

      if (blockFeet?.isAir && blockHead?.isAir && blockBelow && !blockBelow.isAir) {
        // 成功传送
        entity.teleport(
          { x: x + 0.5, y, z: z + 0.5 },
          {
            dimension,
            rotation: entity.getRotation(),
            keepVelocity: false,
          }
        );

        system.runTimeout(() => {
          dimension.playSound("mob.endermen.portal", { x: x + 0.5, y: y + 1, z: z + 0.5 }, { volume: 1, pitch: 1 });
        }, 1);

        return true;
      }
    }
  }

  return false;
}

export function superposeEffects(
  entity: Entity,
  effectType: EffectType | string,
  duration: number,
  options?: EntityEffectOptions
) {
  const existingEffect = entity.getEffect(effectType);
  if (existingEffect) {
    const newDuration = existingEffect.duration + duration;
    entity.addEffect(effectType, newDuration, options);
  } else {
    entity.addEffect(effectType, duration, options);
  }
}

export function getPlayerOnHandItem(player: Player) {
  return player.getComponent(EntityComponentTypes.Inventory)?.container.getItem(player.selectedSlotIndex);
}

export function setPlayerOnHandItem(player: Player, item: ItemStack) {
  return player.getComponent(EntityComponentTypes.Inventory)?.container.setItem(player.selectedSlotIndex, item);
}

export function updatePlayerOnHandItemDynamicJson<T>(
  player: Player,
  item: ItemStack,
  itemJson: DynamicJson<T>,
  changedItemObj: T
) {
  itemJson.set(changedItemObj);
  setPlayerOnHandItem(player, item);
}

export function tryToSpendItem(
  player: Player,
  itemType: string,
  failure: () => void,
  success: () => void,
  requiredAmount: number
  // spendOnCreative: boolean = false
) {
  const gameMode = player.getGameMode();
  const inventory = player.getComponent(EntityComponentTypes.Inventory)?.container;
  if (!inventory) return;

  if (gameMode !== GameMode.Creative) {
    if (requiredAmount > 0) {
      if (!inventory.contains(new ItemStack(itemType))) {
        failure();
        return;
      }
      player.runCommand(`clear @s ${itemType} 0 ${requiredAmount}`);
    }
  }
  success();
}
