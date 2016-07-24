import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {NavController, Alert} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LoginPage} from '../../pages/login/login';

declare var firebase: any;

@Injectable()
export class AuthData {
  
	public fireAuth: any;

  constructor(public nav: NavController) {
    this.fireAuth = firebase.auth();
  }

  loginUser(email: string, password: string): any {
		return this.fireAuth.signInWithEmailAndPassword(email, password).then((authData) => {
			this.nav.setRoot(HomePage);
		}, (error) => {
				let prompt = Alert.create({
					message: error.message,
					buttons: [{text: "Ok"}]
				});
				this.nav.present(prompt);
		});
	}
	
	signupUser(email: string, password: string): any {
		return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
			this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
				firebase.database().ref('/users').child(authenticatedUser.uid).set({
					firstName: null,
					lastName: null,
					email: email
				}).then(() => {
					this.nav.setRoot(HomePage);
				});
			})
		}, (error) => {
			var errorMessage: string = error.message;
				let prompt = Alert.create({
					message: errorMessage,
					buttons: [{text: "Ok"}]
				});
				this.nav.present(prompt);
		});
	}
	
	resetPassword(email: string): any {
		return this.fireAuth.sendPasswordResetEmail(email).then((user) => {
			let prompt = Alert.create({
				message: "We just sent you a reset link to your email",
				buttons: [{text: "Ok"}]
			});
			this.nav.present(prompt);
		}, (error) => {
			var errorMessage: string;
			switch (error.code) {
				case "auth/invalid-email":
					errorMessage = "You'll need to write a valid email address";
					break;
				case "auth/user-not-found":
					errorMessage = "That user does not exist";
					break;
				default:
					errorMessage = error.message;
			}
			
			let prompt = Alert.create({
				message: errorMessage,
				buttons: [{text: "Ok"}]
			});

			this.nav.present(prompt);
		});
	}
	
	logout(): any {
		return this.fireAuth.signOut();
	}
	
}
