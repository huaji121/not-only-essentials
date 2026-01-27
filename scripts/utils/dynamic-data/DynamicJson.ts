import { DynamicData } from "./DynamicData";
import { IDynamicPropertyTarget } from "../interfacaces/IDynamicPropertyTarget";

export class DynamicJson<T> {
  dynamic_data: DynamicData<string>;
  constructor(target: IDynamicPropertyTarget, id: string, value?: T) {
    this.dynamic_data = new DynamicData(target, id, value == undefined ? undefined : JSON.stringify(value));
  }
  get(): T | undefined {
    const raw = this.get_raw();
    if (raw != undefined) return JSON.parse(raw);
  }
  get_raw() {
    return this.dynamic_data?.get();
  }
  set(value: T): void {
    this.set_raw(JSON.stringify(value));
  }
  set_raw(value: string): void {
    this.dynamic_data?.set(value);
  }
  free(): void {
    this.dynamic_data?.free();
  }
  with_set(callback: (arg0: T) => T) {
    const value = this.get();
    if (value != undefined) {
      this.set(callback(value));
    }
  }
}
