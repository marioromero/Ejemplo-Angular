import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfertas } from './admin-ofertas';

describe('AdminOfertas', () => {
  let component: AdminOfertas;
  let fixture: ComponentFixture<AdminOfertas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOfertas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOfertas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
