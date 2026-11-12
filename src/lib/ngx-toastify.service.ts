import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ToastifyAction,
  ToastifyHandle,
  ToastifyManager,
  ToastifyOptions,
  ToastifyPosition,
  ToastifyType,
  ToastifyUpdateOptions,
} from '@andreasnicolaou/toastify';
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
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    this.position = inject(TOASTIFY_POSITION, { optional: true }) ?? DEFAULT_TOASTIFY_POSITION;
    this.options = inject(TOASTIFY_OPTIONS, { optional: true }) ?? undefined;
    // Creating the manager never touches the DOM (containers are created lazily on the first toast).
    this.toastify = new ToastifyManager(this.position, this.withZoneAction(this.options));
    inject(DestroyRef).onDestroy(() => this.toastify.destroy());
  }

  public default(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('default', content, options);
  }

  public light(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('light', content, options);
  }

  public success(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('success', content, options);
  }

  public error(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('error', content, options);
  }

  public warning(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('warning', content, options);
  }

  public info(content: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    return this.show('info', content, options);
  }

  private show(type: ToastifyType, { title, message = '' }: ToastContent, options?: ToastifyOptions): ToastifyHandle {
    if (!this.isBrowser) {
      // No document on the server: hand back an inert handle instead of throwing.
      const handle = new ToastifyHandle();
      // An unattached core handle buffers updates; SSR should retain none of them.
      handle.update = (): void => undefined;
      return handle;
    }
    const handle = this.toastify[type](title, message, this.withZoneAction(options));
    this.wrapUpdate(handle);
    return handle;
  }

  /** Makes `handle.update({ action })` run the new action's callback inside the zone as well. */
  private wrapUpdate(handle: ToastifyHandle): void {
    const update = handle.update.bind(handle);
    handle.update = (updates: ToastifyUpdateOptions): void => update(this.withZoneAction(updates));
  }

  /** Returns the options with `action.onClick` wrapped in `NgZone.run`, leaving the input untouched. */
  private withZoneAction<T extends { action?: ToastifyAction }>(options: T): T;
  private withZoneAction<T extends { action?: ToastifyAction }>(options: T | undefined): T | undefined;
  private withZoneAction<T extends { action?: ToastifyAction }>(options: T | undefined): T | undefined {
    const action = options?.action;
    if (!options || !action) {
      return options;
    }
    return {
      ...options,
      action: { ...action, onClick: (handle) => this.zone.run(() => action.onClick(handle)) },
    };
  }
}
