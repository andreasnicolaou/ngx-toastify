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
| 2.x          | 19 – 22 | ^2.2.0                    |
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

## 🧩 Features

- Simple toast API: `default`, `light`, `success`, `error`, `warning`, `info`
- Standalone `provideNgxToastify()` and NgModule `forRoot()` entry points
- In-place toast updates via the returned `ToastifyHandle`
- Uses [`@andreasnicolaou/toastify`](https://www.npmjs.com/package/@andreasnicolaou/toastify) under the hood
- Type-safe toast options, with core types re-exported
- Custom CSS class support

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
- **`options`**: Optional — per-toast overrides, merged over the configured defaults

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

Per-toast `ToastifyOptions` (`duration`, `isHtml`, `withProgressBar`, `progressBarDuration`, `closeButton`, `direction`, `showIcons`, `animationType`, `tapToDismiss`, `progressBarDirection`) are documented in the [core package](https://www.npmjs.com/package/@andreasnicolaou/toastify).

### Exports

`NgxToastifyService`, `NgxToastifyModule`, `provideNgxToastify`, `TOASTIFY_POSITION`, `TOASTIFY_OPTIONS`, `DEFAULT_TOASTIFY_POSITION`, and the types `NgxToastifyConfig`, `NgxToastifyOptions`. The core types `ToastifyHandle`, `ToastifyOptions`, `ToastifyPosition`, `ToastifyType`, `ToastifyAnimationType`, and `ToastifyUpdateOptions` are re-exported so you don't need to import from the core package directly.

## 🎨 Styles

To include the styles from @andreasnicolaou/toastify, add the CSS manually:

```jsonc
// angular.json
"styles": [
  "node_modules/@andreasnicolaou/toastify/dist/styles.css"
]
```

## ⬆️ Migrating from 1.x

- Requires `@andreasnicolaou/toastify` **^2.2.0** (was `^1.1.0`) and Angular **19+** (was 14+).
- `NgxToastifyModule.forRoot()` takes a single config object: `forRoot({ position, options })`. Earlier README examples showed `forRoot('top-right', {...})`, which never matched the actual signature.
- Toast methods now return `ToastifyHandle` instead of `void`. This is additive — existing call sites keep working.
- `NgxToastifyService` is now `providedIn: 'root'`, so injecting it without importing the module no longer throws.

## 📦 Contribution

Contributions are welcome! If you encounter issues or have ideas to enhance the library, feel free to submit an **issue** or **pull request**.
