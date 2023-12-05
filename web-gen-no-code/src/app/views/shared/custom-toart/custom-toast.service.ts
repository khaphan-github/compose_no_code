import { Injectable } from '@angular/core';
import { SharedState } from 'src/app/core/state/global-state';

export type TToast = {
  show?: boolean,
  title: string,
  desc?: string,
  color?: 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'danger' | 'dark' | 'light'
}

@Injectable({
  providedIn: 'root'
})
export class CustomToastService extends SharedState<TToast> {
  constructor() {
    super();
  }

  override setState(state: TToast | null): void {
    super.setState(state);
    super.pushStateToSubscriber();
  }
}
