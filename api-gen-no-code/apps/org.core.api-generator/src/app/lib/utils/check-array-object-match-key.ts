
export function checkObjectsForSameKey(arr: object[]): boolean {
  if (arr.length === 0) {
    throw new Error("Array is empty.");
  }
  const firstObjectKeys = Object.keys(arr[0]);

  for (let i = 1; i < arr.length; i++) {
    const currentObjectKeys = Object.keys(arr[i]);

    if (
      currentObjectKeys.length !== firstObjectKeys.length ||
      !currentObjectKeys.every((key) => firstObjectKeys.includes(key))
    ) {
      return false;
    }
  }
  return true;
}