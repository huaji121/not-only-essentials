import { Vector3 } from "@minecraft/server";

export function formatVector3(vector: Vector3): string {
  return `(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;
}
