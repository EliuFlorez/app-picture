import {Platform, NavController, Loading} from 'ionic-angular';
import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/common';
import {AuthData} from '../../providers/auth-data/auth-data';
import {SignupPage} from '../signup/signup';
import {ResetPasswordPage} from '../reset-password/reset-password';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthData]
})

export class LoginPage {

  public loginForm: any;
 
  constructor(
		public platform: Platform, 
		public nav: NavController, 
		public authData: AuthData, 
		public formBuilder: FormBuilder
	) {
    this.nav = nav;
    this.authData = authData;
 
    this.loginForm = formBuilder.group({
      email: ['', Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      password: ['', Validators.required, Validators.minLength(6), Validators.maxLength(24)]
    })
  }

	loginUser(event){
		event.preventDefault();
		this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password);
		let loading = Loading.create({
			dismissOnPageChange: true,
		});
		this.nav.present(loading);
	}
	
	goToSignup(){
		this.nav.push(SignupPage);
	}

	goToResetPassword(){
		this.nav.push(ResetPasswordPage);
	}
	
}
