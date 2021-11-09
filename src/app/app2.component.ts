import { EventHub } from 'golden-layout';
import { Component, Input } from '@angular/core';
import { AppService } from './app.service';


@Component({
  selector: 'my-app2',
  template: `<h1 style="color: red;">{{message}} - {{service.count}}</h1><br/>
  <button (click)="onClick()">Click me</button><br/>
  <span *ngIf="eventReceived">Event received</span>`
})
export class App2Component {
  @Input() message = 'Not set';
  private eventHub!: EventHub;
  public eventReceived = false;

  constructor(public service: AppService) { }

  setEventHub(hub: EventHub): void {
    this.eventHub = hub;
    this.eventHub.on('userBroadcast', () => {
      this.eventReceived = true;
    });
  }

  onClick(): void {
    this.service.add();
    this.message = 'Clicked !';
  }
}
