import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

declare var firebase: any;

@Injectable()
export class ProfileData {
	
	public userProfile: any;
  public currentUser: any;

  constructor() {
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/users');
  }
 
  getUserProfile(): any {
    return this.userProfile.child(this.currentUser.uid);
  }
 
  updateName(firstName: string, lastName: string): any {
    return this.userProfile.child(this.currentUser.uid).update({
      firstName: firstName,
      lastName: lastName
    });
  }

  updateEmail(newEmail: string): any {
    this.currentUser.updateEmail(newEmail).then(() => {
      this.userProfile.child(this.currentUser.uid).update({
        email: newEmail
      });
    }, (error) => {
      console.log(error);
    });
  }
 
  updatePassword(newPassword: string): any {
    this.currentUser.updatePassword(newPassword).then(() => {
      console.log("Password Changed");
    }, (error) => {
      console.log(error);
    });
  }

}
