import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.css']
})
export class ScrollComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scrollToTop() {
    window.scrollTo(0, 0)
  }
}
