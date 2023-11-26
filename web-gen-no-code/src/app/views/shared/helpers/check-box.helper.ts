export class ComponentCheckBoxHelper<T> {
  selectedItems = new Map<string | number, T>();
  isCheckedAll: boolean = false;
  totalItemInTable: number = 0;

  constructor(private readonly keyName: string) {
    if (keyName.trim().length === 0) {
      throw new Error(`ComponentCheckBoxHelper keyName should not be empty`);
    }
  }

  handleOneChecked(checked: boolean,  item: T | any) {
    checked ? this.selectedItems.set((item as any)[this.keyName], item)
      : this.selectedItems.delete((item as any)[this.keyName]);

    if (this.selectedItems.size < this.totalItemInTable) {
      this.isCheckedAll = false
    } else if (this.selectedItems.size === this.totalItemInTable) {
      this.isCheckedAll = true
    }
  }

  handleCheckAllItems(checked: boolean, item: T[]) {
    this.isCheckedAll = checked;
    if (!checked) {
      this.selectedItems.clear();
    } else {
      for (let index = 0; index < item.length; index++) {
        this.selectedItems.set((item[index] as any)[this.keyName.toString()], item[index]);
      }
    }
  }

  getArraySelected = () => {
    return Array.from(this.selectedItems.values());
  }

  refreshCheckBox() {
    this.selectedItems.clear();
    this.isCheckedAll = false;
  }

  checkedThisItem(item: T) {
    return this.selectedItems.get((item as any)[this.keyName]) !== undefined;
  }


}
