export function djb2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // hash * 33 + char
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  // 转为 ASCII 十六进制（固定 8 位）
  return (hash >>> 0).toString(16).padStart(8, "0");
}
