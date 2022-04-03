import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import {
  AddIngredient,
  DeleteIngredient,
  StopEdit,
  UpdateIngredient,
} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private editedItem: Ingredient;
  public editMode = false;

  @Output() ingredientAdded = new EventEmitter<Ingredient>();

  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select('shoppingList').subscribe(stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopEdit());
    this.subscriptions.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new AddIngredient(newIngredient));
    }
    this.onClear();
  }

  onClear(): void {
    this.store.dispatch(new StopEdit());
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete(): void {
    this.store.dispatch(new DeleteIngredient());
    this.onClear();
  }
}
