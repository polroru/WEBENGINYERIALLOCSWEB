import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugView } from './bug-view';

describe('BugView', () => {
  let component: BugView;
  let fixture: ComponentFixture<BugView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
