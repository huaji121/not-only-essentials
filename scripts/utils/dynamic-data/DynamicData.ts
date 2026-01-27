import { Vector3 } from "@minecraft/server";
import { IDynamicPropertyTarget } from "../interfacaces/IDynamicPropertyTarget";

export type DynamicPropertyValueType = boolean | number | string | Vector3 | undefined;

export class DynamicData<T extends DynamicPropertyValueType> {
  id: string;
  target: IDynamicPropertyTarget;

  constructor(target: IDynamicPropertyTarget, id: string, value: T = <T>undefined) {
    this.id = id;
    this.target = target;
    if (value != undefined) {
      if (this.get() == undefined) {
        this.set(value);
      }
    }
  }

  get(): T {
    return <T>this.target.getDynamicProperty(this.id);
  }
  set(value: T): void {
    this.target.setDynamicProperty(this.id, value);
  }
  free(): void {
    this.set(<T>undefined);
  }
}
