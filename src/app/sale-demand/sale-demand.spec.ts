import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDemand } from './sale-demand';

describe('SaleDemand', () => {
  let component: SaleDemand;
  let fixture: ComponentFixture<SaleDemand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDemand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDemand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
