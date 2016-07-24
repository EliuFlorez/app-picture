import {Platform, Alert, Loading, Page, NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/common';
import {FireData} from '../../providers/fire-data/fire-data';

@Component({
  templateUrl: 'build/pages/comment/comment.html',
  providers: [FireData]
})

export class CommentPage {

  public commentForm: any;
  public comments: any;
	sid: any;
	
  constructor(
		public platform: Platform, 
		public nav: NavController, 
		navParams: NavParams, 
		public fireData: FireData, 
		public formBuilder: FormBuilder
	) {
    this.nav = nav;
    this.fireData = fireData;
		this.sid = navParams.get('id');
		
		this.comments = [];
		this.comments = this.fireData.loadData('comments', 'PID');
		let loading = Loading.create({
			dismissOnPageChange: true,
		});
		this.nav.present(loading);
		
    this.commentForm = formBuilder.group({
      text: ['', Validators.required]
    });
  }
	
	commentCreate(event) {
		event.preventDefault();
		var params = {text: this.commentForm.value.text};
		this.fireData.save('comments', params).then(function (data) {
			console.log(data);
		});
	}
	
	commentRemove(id) {
		let confirm = Alert.create({
      title: 'Confirmation',
      message: 'Delete?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete ID: ' + id);
						this.fireData.remove('comments', id);
          }
        }
      ]
    });
		this.nav.present(confirm);
  }
	
	goBack() {
    this.nav.pop();
  }

}
