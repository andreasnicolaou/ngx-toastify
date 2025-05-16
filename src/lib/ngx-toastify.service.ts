import { Inject, Injectable, Optional } from '@angular/core';
import { ToastifyManager, ToastifyOptions, ToastifyPosition } from '@andreasnicolaou/toastify';
import { TOASTIFY_OPTIONS, TOASTIFY_POSITION } from './ngx-toastify.tokens';

@Injectable()
export class NgxToastifyService {
  private readonly toastify!: ToastifyManager;

  constructor(
    @Inject(TOASTIFY_POSITION) public position: ToastifyPosition = 'top-right',
    @Optional()
    @Inject(TOASTIFY_OPTIONS)
    public options?: ToastifyOptions & {
      maxToasts?: number;
      customClasses?: string;
    }
  ) {
    this.toastify =
      typeof options !== 'undefined' ? new ToastifyManager(position, options) : new ToastifyManager(position);
  }

  public default({ title, message = '' }: { title: string; message: string }, options?: ToastifyOptions): void {
    this.toastify.default(title, message, options);
  }

  public success({ title, message = '' }: { title: string; message?: string }, options?: ToastifyOptions): void {
    this.toastify.success(title, message, options);
  }

  public error({ title, message = '' }: { title: string; message?: string }, options?: ToastifyOptions): void {
    this.toastify.error(title, message, options);
  }

  public warning({ title, message = '' }: { title: string; message?: string }, options?: ToastifyOptions): void {
    this.toastify.warning(title, message, options);
  }

  public info({ title, message = '' }: { title: string; message?: string }, options?: ToastifyOptions): void {
    this.toastify.info(title, message, options);
  }
}
