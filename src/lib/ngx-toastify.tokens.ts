import { ToastifyOptions, ToastifyPosition } from '@andreasnicolaou/toastify';
import { InjectionToken } from '@angular/core';

export const TOASTIFY_POSITION = new InjectionToken<ToastifyPosition>('TOASTIFY_POSITION');
export const TOASTIFY_OPTIONS = new InjectionToken<ToastifyOptions>('TOASTIFY_OPTIONS');
