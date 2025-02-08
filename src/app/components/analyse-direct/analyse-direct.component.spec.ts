import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseDirectComponent } from './analyse-direct.component';

describe('AnalyseDirectComponent', () => {
  let component: AnalyseDirectComponent;
  let fixture: ComponentFixture<AnalyseDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyseDirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
