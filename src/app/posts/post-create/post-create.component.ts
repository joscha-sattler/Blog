import {Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { StoryboardService } from 'src/app/storyboard/storyboard.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  // Attribute

  mode = 'create';
  private postId: string;
  post: Post;
  form: FormGroup;
  bildvorschau: string | ArrayBuffer;

  //isDisplay = false;

  constructor(
    public postsService: PostsService,
    public storyboardService: StoryboardService,
    public route: ActivatedRoute
  ) {

  }


  getDisplay() {
    return this.storyboardService.getIsDisplay();
   }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators:[
          Validators.required,
          Validators.minLength(5)
        ]
      }),

      content: new FormControl(null, {
         validators: [
           Validators.required
         ]
      }),

      image: new FormControl(null, {
          validators: [
            Validators.required
          ]
          // asyncValidators: [mimeType] // funktioniert nicht ganz wie gewünscht, manche jpg werden nicht erkannt
        })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {                                                     // Die postId welche wir im Routing definiert haben
        this.mode = 'edit';                                                             // Fall: Bearbeitungs-Modues
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
        this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator};
        this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath}); // für den Fall, dass wir einen Post geladen haben
       });
      } else {
        this.mode = 'create';     // Fall: Post erstellen
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0] //Type conversion, damit erkannt wird, dass es sich um ein htmlinputelement handelt und die Funktion .files erlaubt wird
    this.form.patchValue({image: file}); //storing file - object
    this.form.get('image').updateValueAndValidity();
    //console.log(file);
    //console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.bildvorschau = reader.result; // eingelesene Datei
    };
    reader.readAsDataURL(file);
  }

/*   togglePostButton() {
      this.isDisplay = !this.isDisplay;
  } */

  onSavePost(){
    if (this.form.invalid){                                                                               // falls Formen nicht korrekt ausgefüllt sind, mache nichts
      return;
    }
    if (this.mode === 'create') {                                                                         // wenn neuer Post erstell wird, dann hinzufügen
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);   // Füge Post mit den Werten der Formen ins Array hinzu
      this.storyboardService.toggleIsDisplay();
    } else {                                                                                              // wenn Post bearbeitet wird, dann updaten
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();                                                                                    // Formen werden wieder geleert, nach erfolgreichem erstellen eines Posts
    this.bildvorschau = '';
  }
}
