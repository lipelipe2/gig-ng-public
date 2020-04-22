import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  code$ = new Subject<any>();
  rows$ = new Subject<any>();
  matrix$ = new Subject<any>();
  isLoaded$ = new Subject<any>();
  char$ = new Subject<any>();
  rows = [];
  matrix = [];
  code = '11';
  cols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  charsAllowed = 'abcdefghijklmnopqrstuvwxyz';
  isLoaded = false;
  char = '';

  constructor() {
    this.iniciaMatriz();
    setInterval(() => {
      this.generateChar();
    }, 2000);

    this.getObservableChar().subscribe((char) => {
      this.char = char;
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  generateChar() {
    let randomChar = '';
    let randomResult = 0,
      randomResult2 = 0;
    if (this.char == '') {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[0].length; j++) {
          this.matrix[i][j] = this.charsAllowed.charAt(
            Math.floor(Math.random() * this.charsAllowed.length)
          );
        }
      }
    } else {
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[0].length; j++) {
          randomChar = this.charsAllowed.charAt(
            Math.floor(Math.random() * this.charsAllowed.length)
          );
          if (randomChar != this.char) {
            this.matrix[i][j] = randomChar;
          } else {
            j = j - 1;
          }
        }
      }
      for (let i = 0; i < 20; i++) {
        randomResult = Math.floor(Math.random() * 10);
        randomResult2 = Math.floor(Math.random() * 10);
        if (this.matrix[randomResult][randomResult2] != this.char) {
          this.matrix[randomResult][randomResult2] = this.char;
        } else {
          i = i - 1;
        }
      }
    }
    this.updateCode();
    this.isLoaded = true;
    this.saveIsLoaded(this.isLoaded);
    this.saveMatrix(this.matrix);
  }

  updateCode() {
    let date = new Date();
    let seconds = date.getSeconds();
    let secondsString = '';
    if (seconds < 10) {
      secondsString = '0' + seconds.toString();
    } else {
      secondsString = seconds.toString();
    }

    let matchCell1 = this.matrix[secondsString.charAt(0)][
        secondsString.charAt(1)
      ],
      matchCell2 = this.matrix[secondsString.charAt(1)][
        secondsString.charAt(0)
      ];
    let ocurrencesCell1 = 0,
      ocurrencesCell2 = 0,
      divisor = 2;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[0].length; j++) {
        if (matchCell1 == this.matrix[i][j]) {
          ocurrencesCell1++;
        }
        if (matchCell2 == this.matrix[i][j]) {
          ocurrencesCell2++;
        }
      }
    }
    if (ocurrencesCell1 > 9) {
      while (Math.ceil(ocurrencesCell1 / divisor) > 9) {
        divisor++;
      }
      ocurrencesCell1 = Math.ceil(ocurrencesCell1 / divisor);
    }
    if (ocurrencesCell2 > 9) {
      divisor = 2;
      while (Math.ceil(ocurrencesCell2 / divisor) > 9) {
        divisor++;
      }
      ocurrencesCell2 = Math.ceil(ocurrencesCell1 / divisor);
    }
    this.code = ocurrencesCell1.toString() + ocurrencesCell2.toString();
    this.saveCode(this.code);
  }

  iniciaMatriz() {
    this.cols.forEach((x) => {
      this.matrix.push(new Array(10));
    });
  }

  saveChar(char) {
    this.char$.next(char);
  }

  getObservableChar() {
    return this.char$.asObservable();
  }

  getChar() {
    return this.char;
  }
  getObservableMatrix() {
    return this.matrix$.asObservable();
  }

  getObservableIsLoaded() {
    return this.isLoaded$.asObservable();
  }

  saveMatrix(matrix) {
    this.matrix$.next(matrix);
  }

  saveIsLoaded(loaded) {
    this.isLoaded$.next(loaded);
  }

  saveCode(code) {
    this.code$.next(code);
  }

  getCode() {
    return this.code$.asObservable();
  }

  saveRows(rows) {
    this.rows$.next(rows);
  }

  getObservableRows(): Observable<any> {
    return this.rows$.asObservable();
  }

  getRows() {
    return this.rows;
  }

  getVarCode() {
    return this.code;
  }

  getMatrix() {
    return this.matrix;
  }
}
