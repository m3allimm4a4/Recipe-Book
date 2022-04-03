import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private sunbscription = new Subscription();

  constructor(private store: Store<fromApp.AppState>, @Inject(PLATFORM_ID) private platformId) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sunbscription.add(this.store.dispatch(new AuthActions.AutoLogin()));
    }
  }

  ngOnDestroy(): void {
    this.sunbscription.unsubscribe();
  }
}
