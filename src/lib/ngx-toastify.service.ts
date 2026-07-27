import { Injectable, inject } from '@angular/core';
import { ToastifyHandle, ToastifyManager, ToastifyOptions, ToastifyPosition } from '@andreasnicolaou/toastify';
import {
  DEFAULT_TOASTIFY_POSITION,
  NgxToastifyOptions,
  TOASTIFY_OPTIONS,
  TOASTIFY_POSITION,
} from './ngx-toastify.tokens';

type ToastContent = { title: string; message?: string };

@Injectable({ providedIn: 'root' })
export class NgxToastifyService {
  public readonly position: ToastifyPosition;
  public readonly options?: NgxToastifyOptions;

  private readonly toastify: ToastifyManager;

  constructor() {
    this.position = inject(TOASTIFY_POSITION, { optional: true }) ?? DEFAULT_TOASTIFY_POSITION;
    this.options = inject(TOASTIFY_OPTIONS, { optional: true }) ?? undefined;
    this.toastify = new ToastifyManager(this.position, this.options);
  }

  public default({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.default(title, message, options);
  }

  public light({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.light(title, message, options);
  }

  public success({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.success(title, message, options);
  }

  public error({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.error(title, message, options);
  }

  public warning({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.warning(title, message, options);
  }

  public info({ title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.toastify.info(title, message, options);
  }
}
