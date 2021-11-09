import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { EventHub } from 'golden-layout';
import { AppService } from './app.service';


@Component({
  selector: 'my-app',
  template: `<h1>{{message}} - {{service.count}}</h1><br/>
  <input [(ngModel)]="inputValue"> Value = {{inputValue}}<br/><br/>
  <button (click)="onClick()">Click me</button><br/>
  <span *ngIf="eventReceived">Event received</span>`
})
export class AppComponent implements OnInit, OnDestroy {
  @Input() message = 'Not set';
  private eventHub!: EventHub;
  public eventReceived = false;
  public inputValue = 'initial value';

  constructor(public service: AppService){ }

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

  ngOnInit(): void {
    console.log('OnInit');
  }

  ngOnDestroy(): void {
    console.log('OnDestroy');
  }
}
