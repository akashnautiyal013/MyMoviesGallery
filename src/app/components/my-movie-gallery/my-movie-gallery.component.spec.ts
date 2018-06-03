import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMovieGalleryComponent } from './my-movie-gallery.component';

describe('MyMovieGalleryComponent', () => {
  let component: MyMovieGalleryComponent;
  let fixture: ComponentFixture<MyMovieGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMovieGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMovieGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
