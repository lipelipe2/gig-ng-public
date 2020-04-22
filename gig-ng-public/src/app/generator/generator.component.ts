import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, OnDestroy {
  faClock = faClock;
  faCircle = faCircle;
  cols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  code;
  content = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'];
  matrix;
  disabled = false;
  isLoaded;
  charsAllowed = 'abcdefghijklmnopqrstuvwxyz';
  sub: Subscription[] = [];
  char;

  constructor(private service: DataService) {
    this.code = this.service.getVarCode();
    this.matrix = this.service.getMatrix();
    this.char = this.service.getChar();

    this.sub.push(
      this.service.getObservableIsLoaded().subscribe((isLoaded) => {
        this.isLoaded = isLoaded;
      })
    );

    this.sub.push(
      this.service.getObservableMatrix().subscribe((matrix) => {
        this.matrix = matrix;
      })
    );

    this.sub.push(
      this.service.getCode().subscribe((code) => {
        this.code = code;
      })
    );

    this.sub.push(
      this.service.getObservableChar().subscribe((char) => {
        this.char = char;
      })
    );
  }

  ngOnInit(): void {}

  generateChar() {
    this.service.generateChar();
  }

  isChar(event) {
    this.char = event.key;
    if (!this.charsAllowed.includes(event.key) && event.key != 'Backspace') {
      event.preventDefault();
      return;
    }

    this.service.saveChar(this.char);
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, 4000);
  }

  ngOnDestroy(): void {
    this.sub.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
