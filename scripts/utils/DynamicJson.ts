import { Entity, ItemStack, World } from "@minecraft/server";
import { DynamicLongString } from "./DynamicLongString";

export class DynamicJson<T = any> {
  public storage: DynamicLongString;

  constructor(target: Entity | World | ItemStack, key: string) {
    this.storage = new DynamicLongString(target, key);
  }

  /** 存储对象（自动序列化） */
  set(obj: T) {
    try {
      const json = JSON.stringify(obj);
      this.storage.set(json);
    } catch (e) {
      console.error(`[DynamicJson] JSON stringify failed`, e);
    }
  }

  /** 读取对象（自动反序列化） */
  get(): T | undefined {
    const json = this.storage.get();
    if (json === undefined) return undefined;

    try {
      return JSON.parse(json) as T;
    } catch (e) {
      console.error(`[DynamicJson] JSON parse failed`, e);
      return undefined;
    }
  }

  /** 删除 */
  delete() {
    this.storage.delete();
  }
}
