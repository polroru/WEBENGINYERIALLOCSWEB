import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticles } from './edit-articles';

describe('EditArticles', () => {
  let component: EditArticles;
  let fixture: ComponentFixture<EditArticles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArticles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArticles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
