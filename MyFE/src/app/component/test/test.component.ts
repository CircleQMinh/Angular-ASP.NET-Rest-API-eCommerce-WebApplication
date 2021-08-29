import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {


  constructor(private http: HttpClient,private authService:AuthenticationService) { }
  ngOnInit(): void {

  }

  //url; //Angular 8
  url: any; //Angular 11, for stricter type
  msg = "";

  //selectFile(event) { //Angular 8
  selectFile(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
    }
  }
  upload(){
    this.authService.upLoadIMG(this.url).subscribe(
      data=>{
        console.log(data)
      },
      error=>{
        console.log(error)
      }

    )
  }
}
