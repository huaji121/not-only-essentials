import {
  Dimension,
  EffectType,
  Entity,
  EntityComponentTypes,
  EntityEffectOptions,
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

export function* split_by_bytes(str: string, maxBytes: number) {
  if (maxBytes <= 0) return;
  if (typeof str !== "string" || !str) {
    yield "";
    return;
  }

  let buffer = "";
  let byteCount = 0;
  let i = 0;

  while (i < str.length) {
    const char = str[i];
    let charSize = 1;
    const code = str.charCodeAt(i);

    // 处理代理对（4字节字符）
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
      const nextCode = str.charCodeAt(i + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        charSize = 2;
      }
    }

    // 计算UTF-8字节长度
    let charBytes;
    if (code < 0x80) {
      charBytes = 1;
    } else if (code < 0x800) {
      charBytes = 2;
    } else if (code < 0x10000) {
      charBytes = 3;
    } else {
      charBytes = 4;
    }

    // 处理超大字符
    if (charBytes > maxBytes) {
      if (buffer) {
        yield buffer;
        buffer = "";
        byteCount = 0;
      }
      yield char + (charSize > 1 ? str[i + 1] : "");
      i += charSize;
      continue;
    }

    // 检查是否超出当前块限制
    if (byteCount + charBytes > maxBytes) {
      yield buffer;
      buffer = "";
      byteCount = 0;
    }

    // 添加到当前块
    buffer += char;
    if (charSize > 1) {
      buffer += str[++i];
    }
    byteCount += charBytes;
    i++;
  }

  if (buffer) yield buffer;
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
