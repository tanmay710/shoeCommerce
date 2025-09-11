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
    let panelClass : string[]
    switch(type){
      case 'Success':
        panelClass = ['success-snackbar']
        break
      case 'Error' :
        panelClass = ['error-snackbar']
        break
      case 'Info' : 
        panelClass = ['info-snackbar']
        break
      case 'Warning':
        panelClass = ['warning-snackbar']
        break
    }
    this.snackBar.open(message,'Dismiss',{
      duration : 3000,
      panelClass : panelClass,
      verticalPosition : type === 'Success'? 'top' : 'bottom'
    })
  }
}
