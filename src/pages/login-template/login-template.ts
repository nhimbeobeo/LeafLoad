import { Component, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EventEmitter } from '@angular/core';
import { UserDataProvider } from "../../providers/user-data/user-data";
import { UserSession } from "../../app/UserSession";
import { HttpErrorResponse } from "@angular/common/http";
import { SignupPage } from "../signup/signup";
/**
 * Generated class for the LoginTemplatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-template',
  templateUrl: 'login-template.html',
})
export class LoginTemplatePage {
  user = {
    username: '',
    password: '',
    email: ''
  };
  status: String;

  @Output() login: EventEmitter<any> = new EventEmitter();
  @Output() signUp: EventEmitter<any> = new EventEmitter();
  @Output() skip: EventEmitter<any> = new EventEmitter();

  // Update these properties to hide/show the view
  shouldShowSkipButton: boolean = true;
  shouldShowSignUpButton: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userDataProvider: UserDataProvider, private viewController: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginTemplatePage');
  }

  emitLoginEvent() {
    this.login.emit(this.user);
    this.userDataProvider.login(this.user).subscribe(response => {
      UserSession.loginSuccessfullyWithDictionary(response);
    }, (error: HttpErrorResponse) => {
      this.status = (error.error.message);
    });
  }

  emitSignUpEvent() {
    this.signUp.emit(null);
    this.navCtrl.push(SignupPage);
  }

  emitSkipEvent() {
    this.skip.emit(null);
    // Fragile here
    this.viewController.dismiss();
  }

  // Update status (error) message
  updateAlert(message: string) {
    this.status = message;
  }
}
