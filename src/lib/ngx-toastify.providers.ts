import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ToastifyPosition } from '@andreasnicolaou/toastify';
import {
  DEFAULT_TOASTIFY_POSITION,
  NgxToastifyOptions,
  TOASTIFY_OPTIONS,
  TOASTIFY_POSITION,
} from './ngx-toastify.tokens';

export interface NgxToastifyConfig {
  position?: ToastifyPosition;
  options?: NgxToastifyOptions;
}

/**
 * Configures NgxToastify for a standalone application.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNgxToastify({ position: 'bottom-right', options: { maxToasts: 3 } })],
 * });
 */
export function provideNgxToastify(config?: NgxToastifyConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TOASTIFY_POSITION, useValue: config?.position ?? DEFAULT_TOASTIFY_POSITION },
    { provide: TOASTIFY_OPTIONS, useValue: config?.options },
  ]);
}
