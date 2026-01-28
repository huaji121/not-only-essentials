import { Vector3 } from "@minecraft/server";

export function scaleVector3(vector: Vector3, scale: number) {
  return { x: vector.x * scale, y: vector.y * scale, z: vector.z * scale };
}
