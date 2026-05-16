import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foundation1 } from './foundation1';

describe('Foundation1', () => {
  let component: Foundation1;
  let fixture: ComponentFixture<Foundation1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foundation1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foundation1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
