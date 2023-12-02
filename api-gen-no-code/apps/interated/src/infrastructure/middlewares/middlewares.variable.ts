export enum MiddlewaresVarible {
  UserMetadata = 'userMetadata',
  IsPassAll = 'isPassAll',
}

export interface TokenPayload {
  userId: string;
  tokenId: string;
  iat: number;
  exp: number;
}
