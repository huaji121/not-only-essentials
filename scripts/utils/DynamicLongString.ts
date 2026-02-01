import { Entity, ItemStack, World } from "@minecraft/server";

export class DynamicLongString {
  private static readonly MAX_BYTES = 32767;

  constructor(
    private readonly target: Entity | World | ItemStack,
    private readonly key: string
  ) {}

  /** 写入任意长度字符串（QuickJS / UTF-8 安全） */
  set(value: string) {
    const oldLen = this.getChunkCount();

    let chunk = "";
    let chunkBytes = 0;
    let index = 0;

    for (const char of value) {
      const bytes = encodeURIComponent(char).replace(/%../g, "x").length;

      if (chunkBytes + bytes > DynamicLongString.MAX_BYTES) {
        this.target.setDynamicProperty(`${this.key}_${index}`, chunk);
        index++;
        chunk = char;
        chunkBytes = bytes;
      } else {
        chunk += char;
        chunkBytes += bytes;
      }
    }

    if (chunk.length > 0) {
      this.target.setDynamicProperty(`${this.key}_${index}`, chunk);
      index++;
    }

    this.target.setDynamicProperty(`${this.key}_len`, index);

    // 清理多余分块
    if (oldLen !== undefined && oldLen > index) {
      for (let i = index; i < oldLen; i++) {
        this.target.setDynamicProperty(`${this.key}_${i}`, undefined);
      }
    }
  }

  /** 读取完整字符串 */
  get(): string | undefined {
    const len = this.getChunkCount();
    if (len === undefined) return undefined;

    let result = "";
    for (let i = 0; i < len; i++) {
      const part = this.target.getDynamicProperty(`${this.key}_${i}`);
      if (typeof part === "string") {
        result += part;
      }
    }
    return result;
  }

  /** 删除所有数据 */
  delete() {
    const len = this.getChunkCount();
    if (len !== undefined) {
      for (let i = 0; i < len; i++) {
        this.target.setDynamicProperty(`${this.key}_${i}`, undefined);
      }
    }
    this.target.setDynamicProperty(`${this.key}_len`, undefined);
  }

  private getChunkCount(): number | undefined {
    const len = this.target.getDynamicProperty(`${this.key}_len`);
    return typeof len === "number" ? len : undefined;
  }
}
