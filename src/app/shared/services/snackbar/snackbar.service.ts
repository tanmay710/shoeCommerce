import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  public showSuccess(message : string){
    this.snackBar.open(message,'Dismiss',{
      duration : 3000,
      panelClass : ['success-snackbar'],
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    })
  }

  public showError(message : string){
    this.snackBar.open(message,'Dismiss',{
      duration: 3000,
      panelClass : ['error-snackbar'],
      verticalPosition : 'top'
    })
  }

  public showSnackbar(message : string,type : 'Success' | 'Error' | 'Info' | 'Warning'){
    this.snackBar.open(message,'Dismiss',{
      duration : 3000,
      panelClass : type === 'Success'? ['success-snackbar'] : ['error-snackbar'],
      verticalPosition : type === 'Success'? 'top' : 'bottom'
    })
  }
}
