import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private firebaseApp = initializeApp(environment.firebase);
  private auth = getAuth(this.firebaseApp);
  private googleProvider = new GoogleAuthProvider();
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
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

  checkSession() {
    return this.http.get(`${this.apiUrl}/auth/session`).pipe(
      tap((res: any) => {
        this.userSubject.next(res.data.user);
      })
    )
  }

  /**
   * Logout user
   */
  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.userSubject.next(null))
    );
  }
}

