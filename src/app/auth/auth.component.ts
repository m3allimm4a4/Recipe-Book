import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  public isLoginMode = true;
  public isLoading = false;
  private subscriptions = new Subscription();

  constructor(private viewContainerRef: ViewContainerRef, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        const error = authState.authError;
        if (error) {
          this.showErrorAlert(error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.subscriptions.add(
        this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }))
      );
    } else {
      this.subscriptions.add(
        this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }))
      );
    }

    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertCmp = this.viewContainerRef.createComponent(AlertComponent);
    alertCmp.instance.message = message;
    const sub = alertCmp.instance.closeAlert.subscribe(() => {
      this.subscriptions.add(this.store.dispatch(new AuthActions.ClearError()));
      alertCmp.destroy();
      sub.unsubscribe();
    });
  }
}
