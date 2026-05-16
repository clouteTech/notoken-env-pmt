import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commisioning1 } from './commisioning1';

describe('Commisioning1', () => {
  let component: Commisioning1;
  let fixture: ComponentFixture<Commisioning1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commisioning1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commisioning1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
