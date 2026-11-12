# NgxToastify — @andreasnicolaou/ngx-toastify

Angular wrapper for [`@andreasnicolaou/toastify`](https://www.npmjs.com/package/@andreasnicolaou/toastify) — a lightweight, customizable toast notification manager.

![GitHub contributors](https://img.shields.io/github/contributors/andreasnicolaou/ngx-toastify)
![GitHub License](https://img.shields.io/github/license/andreasnicolaou/ngx-toastify)
![GitHub package.json version](https://img.shields.io/github/package-json/v/andreasnicolaou/ngx-toastify)
![NPM Downloads](https://img.shields.io/npm/dm/%40andreasnicolaou%2Fngx-toastify)

## 📦 Installation

```bash
npm install @andreasnicolaou/ngx-toastify @andreasnicolaou/toastify
```

> Make sure both ngx-toastify and its underlying core package are installed.

### Compatibility

| ngx-toastify | Angular | @andreasnicolaou/toastify |
| ------------ | ------- | ------------------------- |
| 2.1.x        | 19 – 22 | ^2.3.0                    |
| 2.0.x        | 19 – 22 | ^2.2.0                    |
| 1.x          | 14 – 19 | ^1.1.0                    |

## 🚀 Quick Start

### Standalone applications (recommended)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNgxToastify } from '@andreasnicolaou/ngx-toastify';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgxToastify({
      position: 'top-right',
      options: { maxToasts: 3, customClasses: 'my-toast' },
    }),
  ],
});
```

### NgModule applications

```typescript
import { NgxToastifyModule } from '@andreasnicolaou/ngx-toastify';

@NgModule({
  imports: [
    NgxToastifyModule.forRoot({
      position: 'top-right',
      options: { maxToasts: 3, customClasses: 'my-toast' },
    }),
  ],
})
export class AppModule {}
```

> Configuration is optional. `NgxToastifyService` is `providedIn: 'root'`, so you can inject it without any setup and get the defaults (`top-right`, no overrides).

### Showing a toast

```typescript
import { Component, inject } from '@angular/core';
import { NgxToastifyService } from '@andreasnicolaou/ngx-toastify';

@Component({
  selector: 'app-example',
  template: `<button (click)="showToast()">Show Toast</button>`,
})
export class ExampleComponent {
  private readonly toast = inject(NgxToastifyService);

  showToast(): void {
    this.toast.success({ title: 'Success!', message: 'This is a toast message.' });
  }
}
```

## 🔄 Updating a live toast

Every toast method returns a `ToastifyHandle`, which lets you mutate the toast in place while it is still visible. If the toast is still queued (because `maxToasts` was exceeded), updates are buffered and replayed once it appears.

```typescript
const handle = this.toast.info({ title: 'Upload', message: 'Uploading…' });

handle.update({ message: 'Processing…' });
handle.update({ type: 'success', message: 'Done!', withProgressBar: true });
```

## 📌 Persistent toast with an action button, at another position

`position` and `action` are plain `ToastifyOptions`, so they work on every method and can also be set as defaults in `provideNgxToastify({ options })`.

```typescript
this.toast.info(
  { title: 'New version available', message: 'Reload to get the latest update.' },
  {
    duration: 0, // stays until dismissed
    position: 'bottom-center', // overrides the configured position for this toast only
    closeButton: true,
    action: { label: 'Reload', onClick: () => location.reload() },
  },
);

// keep the toast open and update it from the handler
this.toast.error(
  { title: 'Upload', message: 'Failed.' },
  {
    duration: 0,
    action: {
      label: 'Retry',
      dismissOnClick: false,
      onClick: (handle) => handle.update({ message: 'Retrying…', action: undefined }),
    },
  },
);
```

`action.onClick` always runs inside the Angular zone (also for toasts created outside it, and for actions set later via `handle.update({ action })`), so signals and `OnPush` views update without extra work.

## 🧩 Features

- Simple toast API: `default`, `light`, `success`, `error`, `warning`, `info`
- Standalone `provideNgxToastify()` and NgModule `forRoot()` entry points
- In-place toast updates via the returned `ToastifyHandle`
- Uses [`@andreasnicolaou/toastify`](https://www.npmjs.com/package/@andreasnicolaou/toastify) under the hood
- Type-safe toast options, with core types re-exported
- Custom CSS class support
- Per-toast `position` and an `action` button (core `^2.3.0`)
- SSR-safe: on the server the toast methods return an inert handle instead of touching `document`
- Containers are removed automatically when the service's injector is destroyed

## 🛠 API

### `NgxToastifyService` Methods

All methods take the same arguments and return a `ToastifyHandle`.

| Method    | Parameters                                                       | Description           |
| --------- | ---------------------------------------------------------------- | --------------------- |
| `default` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a default toast |
| `light`   | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a light toast   |
| `success` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a success toast |
| `error`   | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows an error toast  |
| `warning` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a warning toast |
| `info`    | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows an info toast   |

- **`title`**: Required — the headline of the toast
- **`message`**: Optional — the body text (defaults to `''`)
- **`options`**: Optional — per-toast overrides, merged over the configured defaults (including `position` and `action`)

Per-toast `ToastifyOptions`:

| Option                                                                                                                     | Description                                                                              |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `duration`, `isHtml`, `withProgressBar`, `progressBarDuration`, `closeButton`, `direction`, `showIcons`, `animationType`, `tapToDismiss`, `progressBarDirection` | See the [core package](https://www.npmjs.com/package/@andreasnicolaou/toastify)          |
| `position`                                                                                                                 | Any `ToastifyPosition`. Shows this toast in another container; defaults to the configured position |
| `action`                                                                                                                   | `ToastifyAction`: `{ label, onClick(handle), dismissOnClick? }`. Dismisses after click unless `dismissOnClick: false` |

With a per-toast `position`, `maxToasts` and `newestOnTop` apply per position. `handle.update()` accepts everything except `position`.

**Server-side rendering:** the service can be constructed on the server; the toast methods return a no-op `ToastifyHandle` there (nothing is rendered). **Teardown:** when the service's injector is destroyed, every container it created is removed from the DOM.

### Configuration

`provideNgxToastify(config?)` and `NgxToastifyModule.forRoot(config?)` both accept:

| Field      | Type                 | Description                                       |
| ---------- | -------------------- | ------------------------------------------------- |
| `position` | `ToastifyPosition`   | Container position. Defaults to `'top-right'`     |
| `options`  | `NgxToastifyOptions` | Default `ToastifyOptions` plus container settings |

`NgxToastifyOptions` extends `ToastifyOptions` with the container-level settings that can only be set once, when the manager is created:

| Option          | Type      | Description                                |
| --------------- | --------- | ------------------------------------------ |
| `maxToasts`     | `number`  | Max toasts visible at once (default `5`)   |
| `customClasses` | `string`  | Extra CSS classes applied to the container |
| `newestOnTop`   | `boolean` | Whether new toasts stack on top            |

Per-toast `ToastifyOptions` are documented above and in the [core package](https://www.npmjs.com/package/@andreasnicolaou/toastify).

### Exports

`NgxToastifyService`, `NgxToastifyModule`, `provideNgxToastify`, `TOASTIFY_POSITION`, `TOASTIFY_OPTIONS`, `DEFAULT_TOASTIFY_POSITION`, and the types `NgxToastifyConfig`, `NgxToastifyOptions`. The core types `ToastifyAction`, `ToastifyHandle`, `ToastifyOptions`, `ToastifyPosition`, `ToastifyType`, `ToastifyAnimationType`, and `ToastifyUpdateOptions` are re-exported so you don't need to import from the core package directly.

## 🎨 Styles

The stylesheet is **not** injected at runtime (neither by this library nor by core 2.3.0 of `@andreasnicolaou/toastify`), so add it yourself through `angular.json`:

```jsonc
// angular.json
"styles": [
  "node_modules/@andreasnicolaou/toastify/dist/styles.css"
]
```

Because no `<style>` element is created and no `style` attribute is written, this is **CSP-friendly**: a strict `style-src` (without `'unsafe-inline'`) works. The action button can be restyled via `.noap-toastify-action` or the CSS variables `--noap-toastify-action-bg`, `--noap-toastify-action-fg`, `--noap-toastify-action-hover-bg`, `--noap-toastify-action-hover-fg`.

## ⬆️ Upgrading from 2.0 to 2.1

- Requires `@andreasnicolaou/toastify` **^2.3.0** (was `^2.2.0`). No signature changes; all additions are backward compatible.
- `action.onClick` callbacks now run inside `NgZone`.
- Toasts are no-ops on the server instead of throwing.

## ⬆️ Migrating from 1.x

- Requires `@andreasnicolaou/toastify` **^2.2.0** (was `^1.1.0`) and Angular **19+** (was 14+).
- `NgxToastifyModule.forRoot()` takes a single config object: `forRoot({ position, options })`. Earlier README examples showed `forRoot('top-right', {...})`, which never matched the actual signature.
- Toast methods now return `ToastifyHandle` instead of `void`. This is additive — existing call sites keep working.
- `NgxToastifyService` is now `providedIn: 'root'`, so injecting it without importing the module no longer throws.

## 📦 Contribution

Contributions are welcome! If you encounter issues or have ideas to enhance the library, feel free to submit an **issue** or **pull request**.
