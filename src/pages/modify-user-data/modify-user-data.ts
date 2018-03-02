import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Events } from 'ionic-angular';
import { UserSession } from "../../app/UserSession";
import { User } from "../../interfaces/User"
import { UserDataProvider } from "../../providers/user-data/user-data";
/**
 * Generated class for the ModifyUserDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 const UserUpdatedInfoEvent = "UserUpdatedInfoEvent";

@IonicPage()
@Component({
  selector: 'page-modify-user-data',
  templateUrl: 'modify-user-data.html',
})
export class ModifyUserDataPage {
  // private _username: string = null;
  // private _password: string = null;
  // private _email : string = null;
  //
  // public get username(): string {
  //   if (this._username) { return this._username; }
  //   return UserSession.username;
  // }
  //
  // public set username(value: string) {
  //   if (UserSession.username)
  // }
  //
  // public get password(): string {
  //
  // }
  //
  // public set password(value: string) {
  //
  // }
  //
  // public get email(): string {
  //
  // }
  //
  // public set email(value: string) {
  //
  // }

  user: User = {
    username: UserSession.username,
    user_id: 0,
    password: '',
    email: UserSession.email,
    full_name: '',
  }

  public get shouldDisableUpdateButton(): boolean {
    return !this.isChanged || !this.isEligible;
  }

  public get isChanged(): boolean {
    let username = this.user.username.trim();
    let email = this.user.email.trim();
    let password = this.user.password.trim();

    return UserSession.username !== username || UserSession.email !== email || (password != null && password !== '');
  }

  public get isEligible() {
    return this.isUsernameEligible && this.isEmailEligible && this.isPasswordEligible;
  }

  public get isUsernameEligible(): boolean {
    let username = this.user.username.trim();
    return username !== '';
  }

  public get isEmailEligible(): boolean {
    // Email is alway elgible
    return true;
  }

  public get isPasswordEligible(): boolean {
    let password = this.user.password;
    if (password.length > 0) {
      return password.length >= 6;
    }

    // Password is eligible to update when its field is empty
    return true;
  }

  constructor(public navCtrl: NavController, public viewController: ViewController, public navParams: NavParams, private userDataProvider: UserDataProvider, public loadingCtrl: LoadingController, private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModifyUserDataPage');
  }

  dismiss() {
    this.viewController.dismiss();
  }

  deleteAccount() {

  }

  updateUserProfileInfo() {
    let newInfo: any = {username: this.user.username.trim(), email: this.user.email.trim()};
    if (this.user.password && this.user.password.trim() !== '') {
      newInfo.password = this.user.password;
    }
    // Display uploading indicator
    let updateLoading = this.displayLoadingActivityIndicator("Updating information...");
    updateLoading.present();

    // Call the service to upload
    this.userDataProvider.updateUserInfo(newInfo).subscribe(res => {
      console.log("Update user info successfully");
      // Stop loading indicator
      updateLoading.dismiss();

      // Display new info downloading indicator
      let newInfoLoading = this.displayLoadingActivityIndicator("Loading new information...");
      newInfoLoading.present();

      // Download the newly updated user's info
      this.userDataProvider.requestCurrentUserInfo().subscribe(res => {
        UserSession.updateWithNewInfo(res);
        newInfoLoading.dismiss();

        // Broadcast a message that user updated info
        // TODO: Move this line below to the service
        this.events.publish(UserUpdatedInfoEvent);

        // Display the success indicator
        let successIndicator = this.displayLoadingActivityIndicator("Successfully updated user info", 1000);
        successIndicator.present();
      });
    }, error => {
      // Stop uplploading indicator in case of failure
      updateLoading.dismiss();
      // Display error message
      let errorLoading = this.displayLoadingActivityIndicator("Unable to update user information", 3000);
      errorLoading.present();

    });
  }

  private displayLoadingActivityIndicator(message: string, duration: number = 0) {
    let config: any = {content: message};

    if (duration != 0) {
      config.duration = duration;
      config.spinner = 'hide';
    }

    let loading = this.loadingCtrl.create(config);

    return loading;
  }

}
