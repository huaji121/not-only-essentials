import { Vector3 } from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

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
