// Signup Request Models
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  loginMethod: 'jwt';
  tenantId?: string;
  role?: string;
}

export interface FirebaseLoginRequest {
  idToken: string;
  loginMethod: 'firebase';
}

// Response Models
export interface User {
  id: string;
  email: string;
  name: string;
  tenantId?: string;
  role?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string; // For JWT
    customToken?: string; // For Firebase
    loginMethod: 'jwt' | 'firebase';
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string; // For JWT
    customToken?: string; // For Firebase
    loginMethod: 'jwt' | 'firebase';
  };
}

