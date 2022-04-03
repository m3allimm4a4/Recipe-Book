import { Action } from '@ngrx/store';

export enum ActionTypes {
  LoginStart = '[Auth] Login Start',
  AuthFail = '[Auth] Login Fail',
  AuthSuccess = '[Auth] Login',
  SignupStart = '[Auth] Signup Start',
  AutoLogin = '[Auth] Auto Login',
  Logout = '[Auth] Logout',
  ClearError = '[Auth] Clear Error',
}

export class AuthSuccess implements Action {
  public readonly type = ActionTypes.AuthSuccess;
  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class Logout implements Action {
  public readonly type = ActionTypes.Logout;
}

export class LoginStart implements Action {
  public readonly type = ActionTypes.LoginStart;
  constructor(public payload: { email: string; password: string }) {}
}

export class AuthFail implements Action {
  public readonly type = ActionTypes.AuthFail;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  public readonly type = ActionTypes.SignupStart;
  constructor(public payload: { email: string; password: string }) {}
}

export class ClearError implements Action {
  public readonly type = ActionTypes.ClearError;
}

export class AutoLogin implements Action {
  public readonly type = ActionTypes.AutoLogin;
}

export type AuthActions =
  | AuthSuccess
  | Logout
  | LoginStart
  | AuthFail
  | SignupStart
  | ClearError
  | AutoLogin;
