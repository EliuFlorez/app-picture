import {Component} from '@angular/core';
import {Platform, Alert, Loading, Modal, Page, ViewController, NavController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {EventDetailsPage} from '../event-details/event-details';
import {EventCreatePage} from '../event-create/event-create';
import {AuthData} from '../../providers/auth-data/auth-data';
import {FireData} from '../../providers/fire-data/fire-data';

import {Event} from '../../models/event';

declare var firebase: any;

@Component({
  templateUrl: 'build/pages/home/home.html',
	providers: [AuthData, FireData]
})
export class HomePage {
	
  events: any;
	//events: Event[];
	sid: any;
	
  constructor(
		private nav: NavController, 
		public navParams: NavParams, 
		public authData: AuthData,
		public fireData: FireData
	) {
		this.nav = nav;
		this.authData = authData;
		this.fireData = fireData;
		
		//this.events = [];
		this.events = this.fireData.loadData('events', 'PID');
		//this.fireData.load('events', 'PID').then(events => this.events = events);
		
		let loading = Loading.create({
			dismissOnPageChange: true,
		});
		this.nav.present(loading);
  }
	
	onLike(value) {
		if (typeof value.key !== 'undefined') {
			console.log('event-likes/'+value.key);
			var key = value.key;
			var ref = firebase.database().ref('event-likes/'+key);
			ref.once('value', (snapshot) => {
				var a = snapshot.exists();
				console.log('exists a:', a);
				var b = snapshot.child(key).exists();
				console.log('exists b:', b);
			}, (error) => {
				console.log("ERROR:", error);
			});
			
			var like = value.like = !value.like;
			var params = {eid: key, like: like};
			this.fireData.create('events', key, 'likes', params).then(function (data) {
				console.log(data);
			});
			
			return like;
		}
	}
	
	eventSearch(event) {
		event.preventDefault();
	}
	
	eventShow(event, data) {
    this.nav.push(EventDetailsPage, {
      data: data
    });
  }
	
	eventCreate(event) {
		this.nav.push(EventCreatePage);
  }
	
	logOut() {
		this.authData.logout();
		this.nav.push(LoginPage);
  }
}
