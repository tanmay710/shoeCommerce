import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogContent,MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  public message : string
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: {message : string}){
      this.message = data.message
     }

  public onConfirm(){
    this.dialogRef.close(true)
  }
  public onClose(){
    this.dialogRef.close(false)
  }
}
