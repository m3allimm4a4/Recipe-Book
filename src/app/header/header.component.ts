import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private _subscriptions = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this._subscriptions.add(
      this.store
        .select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
          this.isAuthenticated = !!user;
        })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  onSaveData() {
    this._subscriptions.add(this.store.dispatch(new RecipeActions.StoreRecipes()));
  }

  onFetchData() {
    this._subscriptions.add(this.store.dispatch(new RecipeActions.FetchRecipes()));
  }

  onLogout() {
    this._subscriptions.add(this.store.dispatch(new AuthActions.Logout()));
  }
}
