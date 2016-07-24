import {Platform, NavController, Loading} from 'ionic-angular';
import {Component, NgZone} from '@angular/core';
import {FireData} from '../../providers/fire-data/fire-data';

// plugin 
import {Camera, File, Toast} from 'ionic-native';

declare var window: any;
declare var firebase: any;

@Component({
  templateUrl: 'build/pages/pic/pic.html',
	providers: [FireData]
})
export class PicPage {

	pictures: any = [];
	progress: number = 0
	
  constructor(public platform: Platform, private nav: NavController, private ngZone: NgZone, public fireData: FireData) {
		this.nav = nav;
		this.platform = platform;
		this.fireData = fireData;
		
		this.pictures = [];
		this.ngZone.run(() => {
			this.pictures = this.fireData.load('images', '');
			let loading = Loading.create({
				dismissOnPageChange: true,
			});
			this.nav.present(loading);
		});
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
          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
						alert('Image - Onload');
            var imageBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imageBlob.name = 'sample.jpg';
						alert('Image - Blob: sample.jpg');
            this.fireData.uploadPhoto(imageBlob, this._uploadProgress)
              .subscribe((data) => {
                alert('imageUrl: ' + data);
                Toast.show("File Uploaded Successfully", "1000", "center").subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              },
              (error) => {
                console.log(error)
                Toast.show("File Error" + error, "5000", "center").subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              });
          };
          reader.onerror = (e) => {
            console.log("Failed file read: " + e.toString());
            alert("Failed file read: " + e.toString());
          };
          reader.readAsArrayBuffer(resFile);
        });
      }, (err) => {
        console.log(err);
        alert('Error File:'+JSON.stringify(err))
      });
    }, (err) => {
      console.log("resolveLocalFileSystemURL", err);
      alert('Error GetPicture: '+JSON.stringify(err))
    });
  }

}
