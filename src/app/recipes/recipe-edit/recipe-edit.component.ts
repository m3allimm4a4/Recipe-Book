import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  private _subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  onSubmit() {
    if (this.editMode) {
      this._subscriptions.add(
        this.store.dispatch(
          new RecipeActions.UpdateRecipe({
            index: this.id,
            newRecipe: this.recipeForm.value,
          })
        )
      );
    } else {
      this._subscriptions.add(
        this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value))
      );
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this._subscriptions.add(
        this.store
          .select('recipes')
          .pipe(map(recipeState => recipeState.recipes.find((recipe, index) => index === this.id)))
          .subscribe(recipe => {
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;

            if (recipe['ingredients']) {
              recipe.ingredients.forEach(e =>
                recipeIngredients.push(
                  new FormGroup({
                    name: new FormControl(e.name, Validators.required),
                    amount: new FormControl(e.amount, [
                      Validators.required,
                      Validators.pattern(/^[1-9]+[0-9]*$/),
                    ]),
                  })
                )
              );
            }
          })
      );
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
}
