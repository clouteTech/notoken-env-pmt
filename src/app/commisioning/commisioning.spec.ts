import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commisioning } from './commisioning';

describe('Commisioning', () => {
  let component: Commisioning;
  let fixture: ComponentFixture<Commisioning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commisioning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commisioning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
