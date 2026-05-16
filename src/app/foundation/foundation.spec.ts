import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foundation } from './foundation';

describe('Foundation', () => {
  let component: Foundation;
  let fixture: ComponentFixture<Foundation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foundation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foundation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
