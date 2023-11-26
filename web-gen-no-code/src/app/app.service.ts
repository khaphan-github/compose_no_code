import { Injectable } from '@angular/core';
import { STORAGED_KEY } from './core/config/storage-key/localstorage.const';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor() { }

  isValidSecretKey = () => {
    return sessionStorage.getItem(STORAGED_KEY.modules.manageApi.connection.secretKey) !== null;
  }
}
