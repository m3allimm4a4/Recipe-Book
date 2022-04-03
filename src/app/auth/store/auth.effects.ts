import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { AuthResponseData } from '../models/auth-response-data.interface';
import { User } from '../models/user.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.ActionTypes.SignupStart),
      switchMap((action: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `${environment.identityToolkit}signUp?key=${environment.firebaseAPIKey}`,
            {
              email: action.payload.email,
              password: action.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(resData =>
              this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                resData.expiresIn
              )
            ),
            catchError(error => this.handleError(error))
          );
      })
    );
  });

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.ActionTypes.LoginStart),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `${environment.identityToolkit}signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(resData =>
              this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                resData.expiresIn
              )
            ),
            catchError(error => this.handleError(error))
          );
      })
    );
  });

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.ActionTypes.AutoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        if (userData._token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.AuthSuccess({
            email: userData.email,
            userId: userData.id,
            token: userData._token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'DUMMY' };
      })
    );
  });

  authRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.ActionTypes.AuthSuccess),
        tap((authSuccessAction: AuthActions.AuthSuccess) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  authLogout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.ActionTypes.Logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ): AuthActions.AuthSuccess {
    this.authService.setLogoutTimer(+expiresIn * 1000);

    const tokenExpirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: tokenExpirationDate,
      redirect: true,
    });
  }

  private handleError(error: any): Observable<AuthActions.AuthFail> {
    let errorMessage = 'An unknown error occurred!';

    if (!error.error || !error.error.error) {
      return of(new AuthActions.AuthFail(errorMessage));
    }

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'WEAK_PASSWORD':
        errorMessage = 'This password is too weak';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is invalid';
        break;
      default:
        errorMessage = 'Something went wrong';
        break;
    }

    return of(new AuthActions.AuthFail(errorMessage));
  }
}
