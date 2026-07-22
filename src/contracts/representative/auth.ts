/** POST /api/v1/representative-auth/login */
export type RepresentativeLoginRequest = {
  email: string;
  password: string;
  /** Reservado — o JWT atual é stateless com duração fixa (não altera expiresAt). */
  rememberMe?: boolean;
};

export type RepresentativeLoginResponse = {
  accessToken: string;
  expiresAt: string;
  representativeId: number;
  name: string;
  email: string;
  representativeCode: string;
};

/** POST /api/v1/representative-auth/forgot-password */
export type RepresentativeForgotPasswordRequest = {
  email: string;
};

export type RepresentativeForgotPasswordResponse = {
  message: string;
};

/** POST /api/v1/representative-auth/reset-password */
export type RepresentativeResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type RepresentativeResetPasswordResponse = {
  success: boolean;
};

/** POST /api/v1/representative-auth/logout */
export type RepresentativeLogoutResponse = {
  message: string;
};
