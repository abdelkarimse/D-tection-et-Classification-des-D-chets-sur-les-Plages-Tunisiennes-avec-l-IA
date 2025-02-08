import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseVideoComponent } from './analyse-video.component';

describe('AnalyseVideoComponent', () => {
  let component: AnalyseVideoComponent;
  let fixture: ComponentFixture<AnalyseVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyseVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
