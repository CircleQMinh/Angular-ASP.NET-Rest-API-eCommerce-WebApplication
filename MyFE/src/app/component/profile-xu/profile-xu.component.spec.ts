import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileXuComponent } from './profile-xu.component';

describe('ProfileXuComponent', () => {
  let component: ProfileXuComponent;
  let fixture: ComponentFixture<ProfileXuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileXuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileXuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
