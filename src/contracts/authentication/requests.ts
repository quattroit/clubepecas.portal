export type RegisterUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  document: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/** POST /api/v1/auth/forgot-password */
export type ForgotPasswordRequest = {
  email: string;
};

/** POST /api/v1/auth/reset-password */
export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};
