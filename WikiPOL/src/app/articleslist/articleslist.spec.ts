import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Articleslist } from './articleslist';

describe('Articleslist', () => {
  let component: Articleslist;
  let fixture: ComponentFixture<Articleslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Articleslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Articleslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
