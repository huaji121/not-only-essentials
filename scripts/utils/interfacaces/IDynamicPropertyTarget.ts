import { Vector3 } from "@minecraft/server";

export interface IDynamicPropertyTarget {
  clearDynamicProperties(): void;

  getDynamicProperty(identifier: string): boolean | number | string | Vector3 | undefined;

  getDynamicPropertyIds(): string[];

  getDynamicPropertyTotalByteCount(): number;

  // setDynamicProperties(
  //   values: Record<string, boolean | number | string | Vector3>
  // ): void;

  setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void;
}
