import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, MenuController, NavController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ProfilePage} from './pages/profile/profile';
import {EventPage} from './pages/event/event';
import {PicPage} from './pages/pic/pic';
import {CommentPage} from './pages/comment/comment';
import {LoginPage} from './pages/login/login';

declare var firebase: any;

@Component({
	templateUrl: 'build/app.html'
})

export class MyApp {

	@ViewChild(Nav) nav: Nav;
	
	auth_id: any;
	auth_name: any;
	auth_email: any;
	auth_avatar: any;
  rootPage: any = LoginPage;
	pages: Array<{title: string, component: any}>;

  constructor(
		public platform: Platform, 
		private menu: MenuController
	) {
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyBqsXK0BLq0M6Hc7lq2PJ1ERclzDFlgB_M",
			authDomain: "dbkeepic.firebaseapp.com",
			databaseURL: "https://dbkeepic.firebaseio.com",
			storageBucket: "dbkeepic.appspot.com"
		};
		
		// Config Firebase
		firebase.initializeApp(config);
		
		// StateChange Firebase
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// If there's a user take him to the home page.
				console.log('UID: ', user);
				
				this.auth_name = user.displayName;
				this.auth_email = user.email;
				
				// since I can connect from multiple devices or browser tabs, we store each connection instance separately
				// any time that connectionsRef's value is null (i.e. has no children) I am offline
				var myConnectionsRef = firebase.database().ref('users/'+user.uid+'/connections');

				// stores the timestamp of my last disconnect (the last time I was seen online)
				var lastOnlineRef = firebase.database().ref('users/'+user.uid+'/lastOnline');

				var connectedRef = firebase.database().ref('.info/connected');
				connectedRef.on('value', function(snap) {
					if (snap.val() === true) {
						// We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

						// add this device to my connections list
						// this value could contain info about the device or a timestamp too
						var con = myConnectionsRef.push(true);

						// when I disconnect, remove this device
						con.onDisconnect().remove();

						// when I disconnect, update the last time I was seen online
						lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
					}
				});
				
				this.rootPage = HomePage;
			} else {
				// If there's no user logged in send him to the LoginPage
				this.rootPage = LoginPage;
			}
		});
    
		// Initialize App
		this.initializeApp();
		
		// set our app's pages
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'My Event', component: EventPage },
      { title: 'Pic', component: PicPage },
      { title: 'Comment', component: CommentPage }
    ];
  }
	
	initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
	
	showProfile() {
		this.menu.close();
		this.nav.push(ProfilePage);
  }
	
	openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
