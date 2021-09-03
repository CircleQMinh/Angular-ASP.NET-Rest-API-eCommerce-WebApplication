import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { map } from 'rxjs/operators';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  message: string = ""

  chatMess: any[] = []
  isLogin: boolean = false

  user!: User
  showChatBox = true
  constructor(private authService: AuthenticationService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.getLocalStorage()
    this.showHideChat()
    this.getChat()
  }
  scrollToBottom() {

    let a = document.getElementById("chat_content")
    if (a) {
      a.scrollTop = a.scrollHeight
      // console.log("aa")
    }
    else {
      // console.log("bb")
    }

  }
  showHideChat() {
    this.showChatBox = !this.showChatBox
    if (this.showChatBox == true) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 10)

    }
  }
  postChat() {
    if (this.message.trim().length == 0) {

    }
    else {
      setTimeout(() => {
        this.authService.addChatMess(this.user.displayName, formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss a z', 'en'), this.message, this.user.roles[0]).subscribe(
          data => {
            console.log("mess sent")
          },
          error => {
            this.toast.warning("Try again!")
          }
        )
        this.message = ""
      }, 1000)

    }

  }
  getChat() {

    setInterval(() => {
      this.authService.getChatMess().pipe(map(
        data => {
          const postsArray = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              postsArray.push({ ...data[key], id: key });
            }
          }

          return postsArray.reverse();
        }
      )).subscribe(
        data => {
          //console.log(data)
          this.chatMess = data
          this.chatMess.reverse()
          //console.log(this.chatMess)

        },
        error => {
          console.log(error)
        }
      )


    }, 2000)
  }
  getLocalStorage() {
    if (localStorage.getItem("isLogin")) {

      let timeOut = new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()

      if (timeOut.getTime() < timeNow.getTime()) {
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl = localStorage.getItem("user-imgUrl")!
        this.user.roles = []
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }
}
