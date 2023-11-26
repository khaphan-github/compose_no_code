import { STORAGED_KEY } from './../../../core/config/storage-key/localstorage.const';

export const apiPathBuilder = (endpoint: string) => {
  const domain = localStorage.getItem(STORAGED_KEY.modules.manageApi.connection.hostName) ?? 'http://localhost:3000';
  return `${domain}/api/v1/app/2024/schema${endpoint}`
}
