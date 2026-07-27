/*
 * Public API Surface of ngx-toastify
 */
export { NgxToastifyModule } from './lib/ngx-toastify.module';
export { NgxToastifyService } from './lib/ngx-toastify.service';
export { provideNgxToastify } from './lib/ngx-toastify.providers';
export type { NgxToastifyConfig } from './lib/ngx-toastify.providers';
export { DEFAULT_TOASTIFY_POSITION, TOASTIFY_OPTIONS, TOASTIFY_POSITION } from './lib/ngx-toastify.tokens';
export type { NgxToastifyOptions } from './lib/ngx-toastify.tokens';

// Re-exported from the core package so consumers can type their toast calls
// without importing @andreasnicolaou/toastify directly.
export type {
  ToastifyAnimationType,
  ToastifyHandle,
  ToastifyOptions,
  ToastifyPosition,
  ToastifyType,
  ToastifyUpdateOptions,
} from '@andreasnicolaou/toastify';
