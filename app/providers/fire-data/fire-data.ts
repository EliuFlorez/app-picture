import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

import {NavController, Alert} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LoginPage} from '../../pages/login/login';

declare var firebase: any;

@Injectable()
export class FireData {
	
  public data: any = null;
	public fireAuth: any;
	
  constructor(public nav: NavController) {
    this.data = null;
		this.fireAuth = firebase.auth();
  }
	
	load(firedata, pid) {
		var that = this;
		if (this.data) {
      return Promise.resolve(this.data);
    }
		return new Promise(function (resolve, reject) {
			var data = [];
			var ref = firebase.database().ref(firedata);
			ref.limitToLast(10).on('value', function (snapshot) {
				var data = snapshot.val();
				console.log('data', data);
				resolve(data);
			}, function (error) {
				console.log("ERROR:", error);
				reject(error);
			});
		});
	}
	
	list(firedata, pid) {
		var that = this;
		return new Observable(function (observer) {
			var data = [];
			var ref = firebase.database().ref(firedata);
			ref.limitToLast(10).on('value', function (snapshot) {
				var data = snapshot.val();
				console.log('data', data);
				observer.next(data);
			}, function (error) {
				console.log("ERROR:", error);
				observer.error(error);
			});
		});
	}
	
	loadData(firedata, pid) {
		var that = this;
		return new Observable(function (observer) {
			var ref = firebase.database().ref(firedata);
			ref.on('value', function (snapshot) {
				var arr = [];
				snapshot.forEach(function (value) {
					var data = value.val();
					data['key'] = value.key;
					data['like'] = false;
					arr.push(data);
				});
				observer.next(arr);
			}, function (error) {
				console.log("ERROR:", error);
				observer.error(error);
			});
		});
	}
	
	create(collection, key, object, params) {
    return new Promise(function (resolve, reject) {
			var currentUser = firebase.auth().currentUser;
			var uid = currentUser.uid;
			params['uid'] = uid;
			var ref = firebase.database().ref(collection +'_'+ object).push();
			ref.set(params, function(error) {
				if (!error) {
					var id = ref.key;
					firebase.database().ref().child(collection +'/'+ key +'/'+ object +'/'+ uid).set(true);
					firebase.database().ref().child('users/'+ uid +'/'+ collection +'_'+ object +'/'+ id).set(true);
					resolve(params);
				} else {
					var errorMessage: string = error.message;
					let prompt = Alert.create({
						message: errorMessage,
						buttons: [{text: "Ok"}]
					});
					this.nav.present(prompt);
					reject(error);
				}
			});
    });
  }
	
	save(collection, params) {
    return new Promise(function (resolve, reject) {
			var currentUser = firebase.auth().currentUser;
			var uid = currentUser.uid;
			params['uid'] = uid;
			if (collection == 'comments') {
				params['name'] = currentUser.displayName || 'Username';
				params['photoUrl'] = currentUser.photoURL || '/img/ionic.png';
			}
			var ref = firebase.database().ref(collection).push();
			ref.set(params, function(error) {
				if (!error) {
					var key = ref.key;
					params['key'] = key;
					firebase.database().ref().child('/users/'+ uid +'/'+ collection +'/'+ key).set(true);
					resolve(params);
				} else {
					var errorMessage: string = error.message;
					let prompt = Alert.create({
						message: errorMessage,
						buttons: [{text: "Ok"}]
					});
					this.nav.present(prompt);
					reject(error);
				}
			});
    });
  }
	
	update(collection, key, params) {
    return new Promise(function (resolve, reject) {
			var ref = firebase.database().ref(collection +'/'+ key);
			ref.update(params).then(function () {
				console.log('update success: ' + key);
				resolve(params);
			}).catch(function (error) {
				var errorMessage: string = error.message;
				let prompt = Alert.create({
					message: errorMessage,
					buttons: [{text: "Ok"}]
				});
				this.nav.present(prompt);
				reject(error);
			});
    });
  }
	
	remove(collection, key) {
    return new Promise(function (resolve, reject) {
			var ref = firebase.database().ref(collection +'/'+ key);
			ref.remove().then(function () {
				console.log('remove success: ' + key);
				resolve(true);
			}).catch(function (error) {
				var errorMessage: string = error.message;
				let prompt = Alert.create({
					message: errorMessage,
					buttons: [{text: "Ok"}]
				});
				this.nav.present(prompt);
				reject(error);
			});
    });
  }
	
	uploadPhoto(_imageData, _progress) {
		return new Observable(observer => {
			var _time = new Date().getTime()
			var uid = firebase.auth().currentUser.uid;
			alert('Image - UID:' + uid);
			var imageName = uid +'_'+_time+'.jpg'
			alert('Image - Name:' + imageName);
			var fileRef = firebase.storage().ref('images/' + imageName)
			var uploadTask = fileRef.put(_imageData);
			uploadTask.on('state_changed', 
				function progress(snapshot) {
					console.log('state_changed', snapshot);
					_progress && _progress(snapshot)
				}, 
				function error(err) {
					console.log(JSON.stringify(err));
					observer.error(err)
				}, 
				function complete() {
					var downloadURL = uploadTask.snapshot.downloadURL;
					alert('Image - URL:' + downloadURL);
					fileRef.getMetadata().then(function (_metadata) {
						var id = firebase.database().ref('images').push();
						var key = id.key;
						alert('Image - Key:' + key);
						id.set({
							'imageURL': downloadURL,
							'uid': uid,
							'time': _time,
							//'meta': _metadata
						}, function(error) {
							if (!error) {
								var key = id.key;
								alert('Image - Key:' + key);
								firebase.database().ref().child('/users/'+uid+'/images/'+key).set(true);
							}
						});
						observer.next(downloadURL)
					}).catch(function (error) {
						observer.error(error)
					});
				}
			);
		});
	}
	
}
