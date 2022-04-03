import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';
import * as fromAction from '../store/recipe.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAction.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(`${environment.realtimeDatabase}recipes.json`);
      }),
      map(recipes =>
        recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        })
      ),
      map(recipes => new fromAction.SetRecipes(recipes))
    );
  });

  storeRecipes = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromAction.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(`${environment.realtimeDatabase}recipes.json`, recipesState.recipes);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
