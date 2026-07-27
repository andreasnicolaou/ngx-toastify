import { ToastifyOptions, ToastifyPosition } from '@andreasnicolaou/toastify';
import { InjectionToken } from '@angular/core';

/**
 * Options accepted by `ToastifyManager`, i.e. the per-toast defaults plus the
 * container-level settings that can only be set once when the manager is created.
 */
export type NgxToastifyOptions = ToastifyOptions & {
  maxToasts?: number;
  customClasses?: string;
  newestOnTop?: boolean;
};

export const TOASTIFY_POSITION = new InjectionToken<ToastifyPosition>('TOASTIFY_POSITION');
export const TOASTIFY_OPTIONS = new InjectionToken<NgxToastifyOptions>('TOASTIFY_OPTIONS');

export const DEFAULT_TOASTIFY_POSITION: ToastifyPosition = 'top-right';
