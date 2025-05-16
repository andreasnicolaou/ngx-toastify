import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxToastifyService } from './ngx-toastify.service';
import { ToastifyPosition, ToastifyOptions } from '@andreasnicolaou/toastify';
import { TOASTIFY_OPTIONS, TOASTIFY_POSITION } from './ngx-toastify.tokens';

@NgModule({
  providers: [
    {
      provide: TOASTIFY_POSITION,
      useValue: 'top-right',
    },
    {
      provide: TOASTIFY_OPTIONS,
      useValue: undefined,
    },
    NgxToastifyService,
  ],
})
export class NgxToastifyModule {
  static forRoot(config?: {
    position?: ToastifyPosition;
    options?: ToastifyOptions & {
      maxToasts?: number;
      customClasses?: string;
    };
  }): ModuleWithProviders<NgxToastifyModule> {
    return {
      ngModule: NgxToastifyModule,
      providers: [
        {
          provide: TOASTIFY_POSITION,
          useValue: config?.position ?? 'top-right',
        },
        {
          provide: TOASTIFY_OPTIONS,
          useValue: config?.options,
        },
        NgxToastifyService,
      ],
    };
  }
}
