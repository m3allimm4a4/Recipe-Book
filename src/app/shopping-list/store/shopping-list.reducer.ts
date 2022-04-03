import { Ingredient } from '../../shared/models/ingredient.model';
import { ShoppingListActions, ShoppingListActionTypes } from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActionTypes.AddIngredient:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };

    case ShoppingListActionTypes.AddIngredients:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case ShoppingListActionTypes.UpdateIngredient:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload,
      };
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, state.editedIngredientIndex),
          updatedIngredient,
          ...state.ingredients.slice(state.editedIngredientIndex + 1),
        ],
        editedIngredientIndex: -1,
        editedIngredient: null,
      };

    case ShoppingListActionTypes.DeleteIngredient:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.slice(0, state.editedIngredientIndex),
          ...state.ingredients.slice(state.editedIngredientIndex + 1),
        ],
        editedIngredientIndex: -1,
        editedIngredient: null,
      };

    case ShoppingListActionTypes.StartEdit:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };

    case ShoppingListActionTypes.StopEdit:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
}
