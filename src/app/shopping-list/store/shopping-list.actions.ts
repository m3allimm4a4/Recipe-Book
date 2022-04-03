import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/models/ingredient.model';

export enum ShoppingListActionTypes {
  AddIngredient = '[Shopping List] ADD_INGREDIENT',
  AddIngredients = '[Shopping List] ADD_INGREDIENTS',
  UpdateIngredient = '[Shopping List] UPDATE_INGREDIENT',
  DeleteIngredient = '[Shopping List] DELETE_INGREDIENT',
  StartEdit = '[Shopping List] START_EDIT',
  StopEdit = '[Shopping List] STOP_EDIT',
}

export class AddIngredient implements Action {
  public readonly type = ShoppingListActionTypes.AddIngredient;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  public readonly type = ShoppingListActionTypes.AddIngredients;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  public readonly type = ShoppingListActionTypes.UpdateIngredient;
  constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
  public readonly type = ShoppingListActionTypes.DeleteIngredient;
}

export class StartEdit implements Action {
  public readonly type = ShoppingListActionTypes.StartEdit;
  constructor(public payload: number) {}
}

export class StopEdit implements Action {
  public readonly type = ShoppingListActionTypes.StopEdit;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;
