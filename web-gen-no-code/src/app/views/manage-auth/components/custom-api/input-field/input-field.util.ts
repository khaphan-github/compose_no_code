export function buildObjectToJson(ob: object) {
  const result: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(ob)) {
    result[value] = `Dữ liệu mẫu number/string`
  }

  return JSON.stringify(result, null, 2);
}
