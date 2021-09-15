import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrderInfoComponent } from './profile-order-info.component';

describe('ProfileOrderInfoComponent', () => {
  let component: ProfileOrderInfoComponent;
  let fixture: ComponentFixture<ProfileOrderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOrderInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
