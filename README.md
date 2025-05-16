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

## 🚀 Quick Start

1. Import `NgxToastifyModule` in your `AppModule`

```typescript
import { NgxToastifyModule } from '@andreasnicolaou/ngx-toastify';

@NgModule({
  imports: [
    NgxToastifyModule.forRoot('top-right', {
      maxToasts: 3,
      customClasses: 'my-toast',
    }),
  ],
})
export class AppModule {}
```

> `forRoot()` is optional. If omitted, it will use default values.

2. Use the `NgxToastifyService` in your components

```typescript
import { Component } from '@angular/core';
import { NgxToastifyService } from '@andreasnicolaou/ngx-toastify';

@Component({
  selector: 'app-example',
  template: `<button (click)="showToast()">Show Toast</button>`,
})
export class ExampleComponent {
  constructor(private ngxToastifyService: NgxToastifyService) {}

  showToast() {
    this.ngxToastifyService.success({ title: 'Success!', message: 'This is a toast message.' });
  }
}
```

## 🧩 Features

- Simple toast API: success, error, info, warning, default
- Uses [`@andreasnicolaou/toastify`](https://www.npmjs.com/package/@andreasnicolaou/toastify) under the hood
- Optional configuration using forRoot()
- Type-safe toast options
- Custom CSS class support

## 🛠 API

### `NgxToastifyService` Methods

| Method    | Parameters                                                       | Description           |
| --------- | ---------------------------------------------------------------- | --------------------- |
| `default` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a default toast |
| `success` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a success toast |
| `error`   | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows an error toast  |
| `warning` | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows a warning toast |
| `info`    | `{ title: string, message?: string }, options?: ToastifyOptions` | Shows an info toast   |

- **`title`**: Required — the headline of the toast
- **`message`**: Optional — the body text (defaults to `''`)
- **`options`**: Optional — configuration object from the core [`@andreasnicolaou/toastify`](https://www.npmjs.com/package/@andreasnicolaou/toastify) package

## 🎨 Styles

To include the styles from @andreasnicolaou/toastify, add the CSS manually:

```jsonc
// angular.json
"styles": [
  "node_modules/@andreasnicolaou/toastify/dist/styles.css"
]
```

## 📦 Contribution

Contributions are welcome! If you encounter issues or have ideas to enhance the library, feel free to submit an **issue** or **pull request**.
