import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foundation11 } from './foundation-11';

describe('Foundation11', () => {
  let component: Foundation11;
  let fixture: ComponentFixture<Foundation11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foundation11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foundation11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
