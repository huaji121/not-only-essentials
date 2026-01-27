import { Vector3 } from "@minecraft/server";

export function formatVector3(vector: Vector3): string {
  return `(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;
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
