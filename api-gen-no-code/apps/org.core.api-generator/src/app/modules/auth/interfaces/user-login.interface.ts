
export interface ITokenPayLoad {
  userId: string;
  tokenId: string;
};

export interface IUserLogin {
  info: {
    metadata: any,
    id: number,
    username: string,
  },
  token: {
    accessToken: string,
    refreshToken: string,
  }
}
