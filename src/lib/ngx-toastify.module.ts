import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxToastifyConfig } from './ngx-toastify.providers';
import { DEFAULT_TOASTIFY_POSITION, TOASTIFY_OPTIONS, TOASTIFY_POSITION } from './ngx-toastify.tokens';

/**
 * NgModule entry point, kept for NgModule-based applications.
 * Standalone applications should use `provideNgxToastify()` instead.
 */
@NgModule({})
export class NgxToastifyModule {
  static forRoot(config?: NgxToastifyConfig): ModuleWithProviders<NgxToastifyModule> {
    return {
      ngModule: NgxToastifyModule,
      providers: [
        {
          provide: TOASTIFY_POSITION,
          useValue: config?.position ?? DEFAULT_TOASTIFY_POSITION,
        },
        {
          provide: TOASTIFY_OPTIONS,
          useValue: config?.options,
        },
      ],
    };
  }
}
