import { Injectable } from '@angular/core';
import { SharedState } from '../../../core/state/global-state';

@Injectable({ providedIn: 'root' })
export class ConnectedToServerEvent extends SharedState<any> {
  constructor() {
    super({ fetchData: false });
  }
  override setState(state: any): void {
    super.setState(state);
    super.pushStateToSubscriber();
  }
}
