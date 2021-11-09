import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  public count = 0;

  public add(): void {
    this.count = this.count + 1;
  }
}
