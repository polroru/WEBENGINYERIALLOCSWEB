import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugCreate } from './bug-create';

describe('BugCreate', () => {
  let component: BugCreate;
  let fixture: ComponentFixture<BugCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
