import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugList } from './bug-list';

describe('BugList', () => {
  let component: BugList;
  let fixture: ComponentFixture<BugList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
