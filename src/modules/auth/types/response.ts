export type AuthResponse = {
  code: string;
  token: string;
};
export type GoogleUser = {
  firstName?: string;
  lastName?: string;
  email: string;
  accessToken?: string;
};
