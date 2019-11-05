import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/core/user-service/user.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/toast/toast.service';

import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  postReviewform: FormGroup;
  getdata1: any[] = [];
  loggedInUserDetails: any;
  today = new Date();
  jstoday: any;
  UserLikesArray: any[] = [];

  constructor(private commentService: UserService, private router: Router, private modalService: NgbModal,
    private toastService: ToastService, private confirmationDialogService: ConfirmationDialogService) {
    this.jstoday = formatDate(this.today, 'MM-dd-yyyy hh:mm:ss a', 'en-US', '+0530');
  }

  ngOnInit() {
    this.loggedInUserDetails = JSON.parse(
      localStorage.getItem("loggedInUser")
    )
    this.postReviewform = new FormGroup({
      PostComment: new FormControl(''),
    })
    this.getdata();
  }

  postdata() {
    const formObject = this.postReviewform.value;
    const finalObj = Object.assign({}, this.postReviewform.value);
    finalObj.createdUsername = this.loggedInUserDetails.name;
    finalObj.createdUserId = this.loggedInUserDetails.userId;
    finalObj.CreatedOn = this.jstoday,
      finalObj.UserLikes = [];
    this.commentService.postdata(finalObj).subscribe(
      data => {
        console.log(data);
        this.getdata();
      }
    )
  }

  getdata() {
    this.commentService.getdata().subscribe(
      data => {
        this.getdata1 = data.sort((a, b) => Number(b.id) - Number(a.id));
       // this.getdata1 = data;
      }
    )
  }

  deletePost(data: any) {
    this.confirmationDialogService
      .confirm('Please confirm..', 'Are you sure you want to Delete ?')
      .then(confirmed => {
        if (confirmed === true) {
          if (data.createdUserId === this.loggedInUserDetails.userId) {
            this.commentService.deletePost(data.id).subscribe(
              x => {
                this.toastService.showSuccess('Successfully Deleted');
              }
            )
          } else {
            this.toastService.showError('you dont have permissions');
          }
        }
      })
      .catch(() => { });
  }

  like(data: any) {
    if (data.createdUserId != this.loggedInUserDetails.userId) {
      this.UserLikesArray.push({ LikenUserId: data.createdUserId, LikedUserName: data.createdUsername });
      const obj = Object.assign({}, data, { UserLikes: this.UserLikesArray });
      this.update(obj);
      this.commentService.updatePosts(obj).subscribe(
        data => {
          this.toastService.showSuccess('Liked Post');
          this.getdata();
        }
      );

    } else {
      this.toastService.showError('you dont have permissions');
    }
  }

  update(obj) {
    console.log(obj);

  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
