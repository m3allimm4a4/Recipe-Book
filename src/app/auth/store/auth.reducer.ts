import { User } from '../models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.ActionTypes.AuthSuccess:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user,
        authError: null,
        loading: false,
      };

    case AuthActions.ActionTypes.Logout:
      return {
        ...state,
        user: null,
        authError: null,
      };

    case AuthActions.ActionTypes.LoginStart:
    case AuthActions.ActionTypes.SignupStart:
      return {
        ...state,
        authError: null,
        loading: true,
      };

    case AuthActions.ActionTypes.AuthFail:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };

    case AuthActions.ActionTypes.ClearError:
      return {
        ...state,
        authError: null,
      };

    default:
      return state;
  }
}
