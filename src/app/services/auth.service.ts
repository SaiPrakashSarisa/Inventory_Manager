import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import { 
  SignupRequest, 
  SignupResponse, 
  FirebaseLoginRequest, 
  LoginResponse 
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private firebaseApp = initializeApp(environment.firebase);
  private auth = getAuth(this.firebaseApp);
  private googleProvider = new GoogleAuthProvider();
  private apiUrl = environment.apiUrl;

  /**
   * Sign up with email and password (JWT)
   */
  signupWithEmail(signupData: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, signupData);
  }

  /**
   * Sign in with Google using Firebase
   * Returns the Firebase ID token
   */
  signInWithGoogle(): Observable<string> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      switchMap((result) => {
        return from(result.user.getIdToken());
      })
    );
  }

  /**
   * Sign in with Google using redirect (alternative method)
   */
  signInWithGoogleRedirect(): Observable<void> {
    return from(signInWithRedirect(this.auth, this.googleProvider));
  }

  /**
   * Get redirect result after Google sign-in redirect
   */
  getRedirectResult(): Observable<FirebaseUser | null> {
    return from(getRedirectResult(this.auth)).pipe(
      switchMap((result) => {
        return from(Promise.resolve(result?.user || null));
      })
    );
  }

  /**
   * Login with Firebase ID token
   */
  loginWithFirebase(idToken: string): Observable<LoginResponse> {
    const request: FirebaseLoginRequest = {
      idToken,
      loginMethod: 'firebase'
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/firebase`, request);
  }

  /**
   * Login with email and password (JWT)
   */
  loginWithEmail(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password,
      loginMethod: 'jwt'
    });
  }

  /**
   * Complete Google signup flow
   * 1. Sign in with Google (Firebase)
   * 2. Get ID token
   * 3. Send to backend for registration/login
   */
  signupWithGoogle(): Observable<LoginResponse> {
    return this.signInWithGoogle().pipe(
      switchMap((idToken) => {
        return this.loginWithFirebase(idToken);
      })
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const customToken = localStorage.getItem('customToken');
    return !!(token || customToken);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('customToken');
  }

  /**
   * Get login method
   */
  getLoginMethod(): string | null {
    return localStorage.getItem('loginMethod');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('customToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginMethod');
  }
}

