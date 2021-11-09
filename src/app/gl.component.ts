import {
  Component, ComponentFactoryResolver, HostListener,
  ViewContainerRef, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';

import {GoldenLayout, LayoutConfig, ComponentItemConfig, RootItemConfig, RowOrColumnItemConfig} from 'golden-layout';

import {AppComponent} from 'src/app/app.component';
import {App2Component} from 'src/app/app2.component';

@Component({
  selector: 'golden-layout',
  template: `<div style="width:100%;height:500px;" id="layout" #layout>My First Angular 2 App</div>
  <br/><button (click)="sendEvent()">Send event through hub</button>`,
  entryComponents: [AppComponent, App2Component]
})
export class GLComponent implements AfterViewInit {
  @ViewChild('layout') private layoutHost!: ElementRef;
  private layout!: GoldenLayout;
  private config: LayoutConfig;

  constructor(private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver){

    const panel1:ComponentItemConfig = {
      type: 'component',
      componentName: 'test1',
      componentType: 'test1',
      componentState: { message: 'Top Left' }
    };
    const panel2:ComponentItemConfig = {
      type: 'component',
      componentName: 'test2',
      componentType: 'test2',
      componentState: { message: 'Top Right' }

    };
    const panel3:ComponentItemConfig = {
      type: 'component',
      componentName: 'test1',
      componentType: 'test1',
      componentState: { message: 'Bottom Right' }

    };
    const root:RowOrColumnItemConfig = {
      type: 'row',
      content: [{
        type: 'row',
        content: [panel1, {
          type: 'column',
          content: [panel2, panel3]
        }]
      }]
    };
    this.config = {
      root,
    };
  }

  ngAfterViewInit(): void{
    this.layout = new GoldenLayout(this.layoutHost.nativeElement);

    this.layout?.registerComponentFactoryFunction('test1', (container: any, componentState: any) => {
          const factory = this.componentFactoryResolver.resolveComponentFactory(AppComponent);

          const compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this.layout.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement);

          container.compRef = compRef;

          compRef.changeDetectorRef.detectChanges();
    });

    this.layout?.registerComponentFactoryFunction('test2', (container: any, componentState: any) => {
          const factory = this.componentFactoryResolver.resolveComponentFactory(App2Component);

          const compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this.layout.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement);

          container.compRef = compRef;

          compRef.changeDetectorRef.detectChanges();
    });

    this.layout?.loadLayout(this.config);

    this.layout.on('itemDestroyed', (item: any) => {
      if (item.container != null) {
        const compRef = item.container.compRef;
        if (compRef != null) {
          compRef.destroy();
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.layout) {
      this.layout?.setSize(
        (event?.target as Window)?.innerWidth,
        (event?.target as Window)?.innerHeight);
    }
  }

  sendEvent(): void{
    if (this.layout) {
      this.layout.eventHub.emit('userBroadcast');
    }
  }
}
