export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  status: string;
  is_verified: boolean;
  last_login: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: UserResponse;
  };
}
