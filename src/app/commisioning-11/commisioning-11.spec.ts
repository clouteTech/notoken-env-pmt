import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commisioning11 } from './commisioning-11';

describe('Commisioning11', () => {
  let component: Commisioning11;
  let fixture: ComponentFixture<Commisioning11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commisioning11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commisioning11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
