export interface RegisterPayload {
  email: string;
  password: string;
  nickname: string;
}

export type LoginPayload = RegisterPayload;

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}
