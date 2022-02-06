export interface UserClass {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: ProviderDatum[];
  stsTokenManager: StsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

export interface UserState {
  user: UserClass | null;
}

declare interface ProviderDatum {
  providerId: string;
  uid: string;
  displayName: null | string;
  email: string;
  phoneNumber: null | string;
  photoURL: null | string;
}

declare interface StsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}

export interface AuthParamsType {
  email: string;
  password: string;
}
