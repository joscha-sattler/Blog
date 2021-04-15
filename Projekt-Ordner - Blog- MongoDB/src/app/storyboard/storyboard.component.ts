import { Component, OnInit} from '@angular/core';

import { Post } from '../posts/post.model';
import { StoryboardService } from './storyboard.service';

@Component({
  selector: 'app-storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.css']
})
export class StoryboardComponent implements OnInit {

  storedPosts = [];

  onPostAdded(post){
    this.storedPosts.push(post);
  }
  constructor(public storyboardService: StoryboardService) { }

  getDisplay() {
   return this.storyboardService.getIsDisplay();
  }

  toggle() {
   this.storyboardService.toggleIsDisplay();
  }



  ngOnInit(): void {
  }

}
