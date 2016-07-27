import {Component, NgZone} from '@angular/core';
import {Platform, Page, NavController, NavParams, List, Item, Toast} from 'ionic-angular';
import {FireData} from '../../providers/fire-data/fire-data';
import {IonicGallery} from '../../directives/ionic-gallery';
import {CommentPage} from '../../pages/comment/comment';
import {Camera, File} from 'ionic-native';

declare var window: any;
declare var firebase: any;

@Component({
  templateUrl: 'build/pages/event-details/event-details.html',
	providers: [FireData],
	directives: [IonicGallery]
})
export class EventDetailsPage {

  selectedItem: any;
  icons: string[];
  items: Array<any>;
	options: any;
	progress: number = 0;

  constructor(
		public platform: Platform,
		private nav: NavController, 
		navParams: NavParams,
		public fireData: FireData,
		private ngZone: NgZone
	) {
		this.platform = platform;
		this.fireData = fireData;
    this.selectedItem = navParams.get('item');

		this.options = {
			urlKey: 'URL',
			thumbKey: 'thumb',
			titleKey: 'title',
			contentKey: 'note',
			colWidth: 100,
			thumbnailClickAction: this.thumbnailClick,
			actionClass: this,
			viewActionButtons: [
				{
					icon: 'download',
					action: this.save
				},
				{
					icon: 'heart',
					action: this.like
				},
				{
					icon: 'chatbubbles',
					action: this.comment
				}
			]
		}
		
    this.items = [];
    for(let i = 1; i < 20; i++) {
			let s = {
        title: 'Item ' + i,
        note: 'This is item #' + i,
				thumb: 'http://placehold.it/120X120',
				URL: 'http://placehold.it/400X350',
      }
      this.items.push(s);
    }
  }
	
	save(item) {
		this.presentToast('item '+item.title+' saved!')
	}
	
	thumbnailClick(item) {
		this.presentToast('item '+item+' clicked!')
	}
	
	like(item) {
		this.presentToast('item '+item.title+' liked!')
	}
	
	comment(item) {
		this.nav.push(CommentPage);
  }
	
	presentToast(text) {
	  let toast = Toast.create({
	    message: text,
	    duration: 3000,
			position: 'bottom'
	  });

	  toast.onDismiss(() => {
	    console.log('Dismissed toast');
	  });

	  this.nav.present(toast);
  }
	
	_uploadProgress = (_progress): void => {
    this.ngZone.run(() => {
      this.progress = Math.round((_progress.bytesTransferred / _progress.totalBytes) * 100);
			alert("UploadProgress: 0.0");
      if (this.progress === 100) {
        setTimeout(() => { this.progress = 0 }, 500);
      }
    })
  }
	
	getPicture(_type) {
    Camera.getPicture({
			quality: 75,
			destinationType: 1,
      sourceType: _type,
			encodingType: 0,
			mediaType: 0,
      targetWidth: 640,
      correctOrientation: true,
			saveToPhotoAlbum: true,
			cameraDirection: 1
    }).then((imageData) => {
			alert('Image - Begin');
      if (this.platform.is("android") && _type === 0) {
        imageData = "file://" + imageData;
				alert(imageData);
      }
      window.resolveLocalFileSystemURL(imageData, (fileEntry) => {
				alert('Image - File');
        fileEntry.file((resFile) => {
					alert('Image - FileEntry');
          let reader = new FileReader();
          reader.onloadend = (evt: any) => {
						alert('Image - Onload');
            let imageBlob: any = new Blob([evt.target.result], {type: 'image/jpeg'});
            imageBlob.name = 'sample.jpg';
						alert('Image - Blob: sample.jpg');
            this.fireData.uploadPhoto(imageBlob, this._uploadProgress)
              .subscribe((data) => {
                alert('imageUrl: ' + data);
              },
              (error) => {
                alert(error);
              });
          };
          reader.onerror = (e) => {
            alert("Failed file read: " + e.toString());
          };
          reader.readAsArrayBuffer(resFile);
        });
      }, (err) => {
        alert('Error File:'+JSON.stringify(err))
      });
    }, (err) => {
      alert('Error GetPicture: '+JSON.stringify(err))
    });
  }

}
