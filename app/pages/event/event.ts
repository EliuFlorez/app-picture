import {Platform, Alert, Loading, Page, NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {EventDetailsPage} from '../event-details/event-details';
import {EventCreatePage} from '../event-create/event-create';
import {EventEditPage} from '../event-edit/event-edit';
import {FireData} from '../../providers/fire-data/fire-data';

@Component({
  templateUrl: 'build/pages/event/event.html',
  providers: [FireData]
})

export class EventPage {

  public events: any;
	
  constructor(
		public platform: Platform, 
		public nav: NavController, 
		public fireData: FireData
	) {
    this.nav = nav;
    this.fireData = fireData;
		
		this.events = [];
		this.events = this.fireData.loadData('events', 'PID');
		let loading = Loading.create({
			dismissOnPageChange: true,
		});
		this.nav.present(loading);
  }
	
	show(event, data) {
    this.nav.push(EventDetailsPage, {
      data: data
    });
  }
	
	create(event) {
    this.nav.push(EventCreatePage);
  }
	
	edit(event, data) {
    this.nav.push(EventEditPage, {
      data: data
    });
  }
	
	goBack() {
    this.nav.pop();
  }

}
