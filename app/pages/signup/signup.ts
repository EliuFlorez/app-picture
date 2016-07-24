import {Platform, NavController, Loading} from 'ionic-angular';
import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/common';
import {AuthData} from '../../providers/auth-data/auth-data';

@Component({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [AuthData]
})
export class SignupPage {

  public signupForm: any;

  constructor(
		public platform: Platform, 
		public nav: NavController, 
		public authData: AuthData, 
		public formBuilder: FormBuilder
	) {
    this.nav = nav;
    this.authData = authData;

    this.signupForm = formBuilder.group({
      email: ['', Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      password: ['', Validators.required, Validators.minLength(6), Validators.maxLength(24)]
    })
  }
	
	signupUser(event) {
		event.preventDefault();
		this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password);
		let loading = Loading.create({
			dismissOnPageChange: true,
		});
		this.nav.present(loading);
	}
	
	goBack() {
    this.nav.pop();
  }
}