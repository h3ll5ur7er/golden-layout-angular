import {
  Component, ComponentFactoryResolver, HostListener, ComponentFactory, ComponentRef,
  ViewContainerRef, ReflectiveInjector, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import {AppComponent} from 'src/app/app.component';
import {App2Component} from 'src/app/app2.component';
import {GoldenLayout} from 'golden-layout';

@Component({
  selector: 'golden-layout',
  template: `<div style="width:100%;height:500px;" id="layout" #layout>My First Angular 2 App</div>
  <br/><button (click)="sendEvent()">Send event through hub</button>`,
  entryComponents: [AppComponent, App2Component]
})
export class GLComponent implements AfterViewInit {
  @ViewChild('layout') private layoutHost?: ElementRef = undefined;
  private layout?: GoldenLayout = undefined;
  private config: any;

  constructor(private el: ElementRef, private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver){
    this.config = {
            content: [{
                type: 'row',
                content: [{
                    type: 'component',
                    componentName: 'test1',
                    componentState: {
                      message: 'Top Left'
                    }
                }, {
                        type: 'column',
                        content: [{
                            type: 'component',
                            componentName: 'test2',
                            componentState: {
                              message: 'Top Right'
                            }
                        }, {
                                type: 'component',
                                componentName: 'test1',
                                componentState: {
                                  message: 'Bottom Right'
                                }
                            }]
                    }]
            }]
        };
  }

  ngAfterViewInit(): void{
    this.layout = new GoldenLayout(this.config, this.layoutHost?.nativeElement);

    this.layout?.registerComponentFactoryFunction('test1', (container: any, componentState: any) => {
          const factory = this.componentFactoryResolver.resolveComponentFactory(AppComponent);

          const compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this?.layout?.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement);

          container.compRef = compRef;

          compRef.changeDetectorRef.detectChanges();
    });

    this.layout?.registerComponentFactoryFunction('test2', (container: any, componentState: any) => {
          const factory = this.componentFactoryResolver.resolveComponentFactory(App2Component);

          const compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this?.layout?.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement);

          container.compRef = compRef;

          compRef.changeDetectorRef.detectChanges();
    });

    this.layout?.init();

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
  onResize(event: any): void {
      if (this.layout) {
        this.layout?.setSize(event.target.innerWidth, event.target.innerHeight);
      }
  }

  sendEvent(): void{
    if (this.layout) {
      // this.layout.eventHub.emit('someEvent');
    }
  }
}
