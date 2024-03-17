import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBirdsComponent } from './user-birds.component';

describe('UserBirdsComponent', () => {
  let component: UserBirdsComponent;
  let fixture: ComponentFixture<UserBirdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBirdsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserBirdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
