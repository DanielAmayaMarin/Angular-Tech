import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionEnergiaComponent } from './produccion-energia.component';

describe('ProduccionEnergiaComponent', () => {
  let component: ProduccionEnergiaComponent;
  let fixture: ComponentFixture<ProduccionEnergiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionEnergiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionEnergiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
