import {Page, Modal, NavController, ViewController, NavParams, Events, Slides} from 'ionic-angular';
import {Component, Input, EventEmitter, Output, ViewChild, ElementRef}  from '@angular/core';

@Component({
    selector: 'ionic-gallery',
    template: '<div (window:resize)="onResize($event)" class="row">\
		  <div *ngFor="let item of items;let i = index" (click)="itemTapped(i)" [ngStyle]="colStyle" class="col">\
		    <div class="thumbnal">\
					<img src="{{item[options.thumbKey]}}"/>\
		      <div *ngIf="options.thumbnailTitleKey" class="thumbnailTitle">{{item[options.thumbnailTitleKey]}} </div>\
		    </div>\
		  </div>\
		</div>',
    styles: [
			'.thumbnailTitle {display: block;}\
			.row {display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:5px;width:100%;flex-flow:row wrap;color:red;}\
			.row .col {display:block;text-align:center;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1 1 30%;padding:5px;}'
		]
})

export class IonicGallery {

    test: string;

    @Input() items: any;
    @Input() options: any;
    @Output() click: EventEmitter<any> = new EventEmitter();
    colStyle: any;

    constructor(private nav: NavController, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.options.colWidth = Math.abs(this.options.colWidth) || 200;
        this.options.urlKey = this.options.urlKey || 'url';
        this.options.thumbKey = this.options.thumbKey || this.options.urlKey;
        this.options.hasContent = this.options.contentKey ? true : false;
        this.colStyle = {}
    }
    
		ngDoCheck() {
        this.calculateCol();
    }
		
    onResize(event) {
        let row = this.elementRef.nativeElement.firstElementChild;
    }

    calculateCol() {
        let row = this.elementRef.nativeElement.firstElementChild;
        let width = row.clientWidth;
        let colWidth = this.options.colWidth;
        let col = Math.trunc(width / colWidth);
        if (col <= 1) col = 1;
        let percent = 100 / col + '%';
        this.colStyle.flexBasis = percent;
        this.colStyle.maxWidth = percent;
    }
		
    itemTapped(item: any) {
        if (!this.options.noImageView) {
            this.presentImageModal(item)
        }
        this.click.emit(item);
    }

    presentImageModal(index: number) {
        let imageModal = Modal.create(ImageView, { items: this.items, options: this.options, index: index });
        imageModal.onDismiss(data => {});
        this.nav.present(imageModal);
    }

}

@Page({
    template: '<ion-header>\
			<ion-toolbar class="headerView">\
				<ion-title>{{title}} </ion-title>\
				<ion-buttons start>\
					<button (click)="dismiss()">\
						<span primary showWhen="ios">Cancel</span>\
						<ion-icon name="close" showWhen="android,windows"></ion-icon>\
					</button>\
				</ion-buttons>\
			</ion-toolbar>\
		</ion-header>\
		<ion-content class="has-no-header">\
			<ion-slides #slider="" [options]="optionSlide" (didChange)="onSlideChanged()">\
				<ion-slide *ngFor="let item of items">\
					<img src="{{item[options.urlKey]}}"/>\
				</ion-slide>\
			</ion-slides>\
			<ion-footer dark clear>\
				<p class="dark clear text-center">\
					<button dark clear *ngFor="let action of actions" (click)="callAction(action)">\
						<ion-icon [name]="action.icon"></ion-icon>\
					</button>\
				</p>\
			</ion-footer>\
		</ion-content>',
    styles: [
			'.image-content {font-size:0.5em;position:absolute;bottom:0;left:0;width:100%;background-color:#f8f8f8;margin-bottom:0;opacity:0.5;}\
			.image-title {}'
		],
})

class ImageView {

    @ViewChild('slider') slider: Slides;
    
		items: any;
    optionSlide: any;
    options: any;
    title: string = '';
    showLongContent: boolean = false;
    actions: Array<any>;
    maxHeight: string = '3em';
    
		constructor(private nav: NavController, private viewCtrl: ViewController, params: NavParams) {
        this.items = params.data.items;
        this.options = params.data.options;
        this.actions = this.options.viewActionButtons || [];
        this.optionSlide = {
            initialSlide: params.data.index,
            loop: true,
            pager: false
        }
    }
		
    onSlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        this.changeTitle();
    }
		
    changeTitle() {
        if (!this.options.titleKey) return;
        let index = this.slider.getActiveIndex() - 1;
        let item = this.items[index]
        this.title = item[this.options.titleKey];
    }
		
    dismiss() {
        this.viewCtrl.dismiss();
    }

    callAction(action) {
        if (action.action) {
            let index = this.slider.getActiveIndex() - 1;
            action.action.call(this.options.actionClass, this.items[index]);
        }
    }
		
    contentOnClick(item) {
        this.showLongContent = !this.showLongContent;
        this.maxHeight = this.showLongContent ? '6em' : '3em';
    }
		
}
