import {Platform, NavController, Alert, Loading} from 'ionic-angular';
import {Component, NgZone} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {EventPage} from '../event/event';
import {FireData} from '../../providers/fire-data/fire-data';

// plugin 
import {Camera, File, Toast} from 'ionic-native';

// Var
declare var window: any;

@Component({
  templateUrl: 'build/pages/event-create/event-create.html',
	providers: [FireData]
})
export class EventCreatePage {

  eventForm: ControlGroup;
	title: AbstractControl;
	description: AbstractControl;
	photoUrl: string = '';
	progress: number = 0;
	
  constructor(
		public platform: Platform, 
		public nav: NavController, 
		private ngZone: NgZone,
		public fireData: FireData, 
		public formBuilder: FormBuilder
	) {
    this.nav = nav;
    this.fireData = fireData;
 
    this.eventForm = formBuilder.group({
      title: ['', Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      description: ['', Validators.maxLength(120)]
    });
		
		this.title = this.eventForm.controls['title'];
		this.description = this.eventForm.controls['description'];
  }
	
	uploadProgress = (_progress): void => {
    this.ngZone.run(() => {
      this.progress = Math.round((_progress.bytesTransferred / _progress.totalBytes) * 100);
			alert("UploadProgress: " + this.progress);
      if (this.progress === 100) {
        setTimeout(() => { this.progress = 0 }, 500);
      }
    })
  }
	
	getPicture() {
    Camera.getPicture({
			quality: 75,
			destinationType: 2,
      sourceType: 0,
			encodingType: 0,
			mediaType: 0,
      targetWidth: 640,
      correctOrientation: true,
			saveToPhotoAlbum: true,
			cameraDirection: 1
    }).then((imageData) => {
			alert('Image - Begin');
      if (this.platform.is("android")) {
        imageData = "file://" + imageData;
      }
			this.photoUrl = imageData;
			alert(imageData);
		});
	}
	
	onSubmit(value: string): void {
		console.log('valid', this.eventForm.valid);
		console.log('value', this.eventForm.value.title);
		console.log('value', this.eventForm.value.description);
		if (this.eventForm.valid || this.eventForm.value.title) {
			var params = {
				title: this.eventForm.value.title,
				description: this.eventForm.value.description,
				photoUrl: this.photoUrl
			};
			this.fireData.save('events', params).then(function (data) {
				console.log(data);
			});
			this.nav.pop();
		} else {
			var message: string = 'The title is required';
			let prompt = Alert.create({
				message: message,
				buttons: [{text: "Ok"}]
			});
			this.nav.present(prompt);
		}
	}

}
