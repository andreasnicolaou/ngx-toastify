import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  PLATFORM_ID,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  signal,
  provideZoneChangeDetection,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxToastifyService } from './ngx-toastify.service';
import { provideNgxToastify } from './ngx-toastify.providers';
import { NgxToastifyModule } from './ngx-toastify.module';

const CONTAINER = '.noap-toastify-container';
const ACTION = '.noap-toastify-action';

function cleanDom(): void {
  document.querySelectorAll(CONTAINER).forEach((el) => el.remove());
}

describe('NgxToastifyService', () => {
  beforeEach(cleanDom);
  afterEach(() => {
    TestBed.resetTestingModule();
    cleanDom();
  });

  describe('options', () => {
    for (const method of ['default', 'light', 'success', 'error', 'warning', 'info'] as const) {
      it(`passes position and action through ${method}`, () => {
        const onClick = jasmine.createSpy('onClick');
        const handle = TestBed.inject(NgxToastifyService)[method](
          { title: method },
          { position: 'bottom-left', duration: 0, action: { label: 'Go', onClick, dismissOnClick: false } }
        );
        expect(document.querySelector(CONTAINER)?.className).toContain('bottom-left');
        document.querySelector<HTMLButtonElement>(ACTION)!.click();
        expect(onClick).toHaveBeenCalledOnceWith(handle);
        expect(document.querySelector(ACTION)?.textContent).toBe('Go');
      });
    }

    for (const mode of ['standalone', 'module'] as const) {
      it(`passes position and action defaults through ${mode} configuration`, () => {
        const onClick = jasmine.createSpy('onClick');
        const config = {
          position: 'top-right' as const,
          options: { position: 'bottom-center' as const, duration: 0, action: { label: 'Default', onClick } },
        };
        TestBed.configureTestingModule(
          mode === 'standalone'
            ? { providers: [provideNgxToastify(config)] }
            : { imports: [NgxToastifyModule.forRoot(config)] }
        );
        TestBed.inject(NgxToastifyService).info({ title: 'Defaults' });
        expect(document.querySelector(CONTAINER)?.className).toContain('bottom-center');
        document.querySelector<HTMLButtonElement>(ACTION)!.click();
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    }
    it('shows a toast at a per-toast position and renders the action button', () => {
      TestBed.configureTestingModule({ providers: [provideNgxToastify({ position: 'top-right' })] });
      const service = TestBed.inject(NgxToastifyService);

      service.info(
        { title: 'Hi' },
        { position: 'bottom-center', duration: 0, action: { label: 'Go', onClick: () => undefined } }
      );

      expect(document.querySelectorAll(CONTAINER).length).toBe(1);
      expect(document.querySelector(CONTAINER)?.className).toContain('bottom-center');
      expect(document.querySelector(ACTION)?.textContent).toBe('Go');
    });

    it('passes a manager-level default action through provideNgxToastify', () => {
      const onClick = jasmine.createSpy('onClick');
      TestBed.configureTestingModule({
        providers: [provideNgxToastify({ options: { duration: 0, action: { label: 'Default', onClick } } })],
      });
      TestBed.inject(NgxToastifyService).success({ title: 'Hi' });

      document.querySelector<HTMLButtonElement>(ACTION)!.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('teardown', () => {
    it('removes every container from the DOM when the injector is destroyed', () => {
      const injector = createEnvironmentInjector([NgxToastifyService], TestBed.inject(EnvironmentInjector));
      const service = injector.get(NgxToastifyService);

      service.info({ title: 'a' }, { duration: 0 });
      service.info({ title: 'b' }, { duration: 0, position: 'bottom-left' });
      expect(document.querySelectorAll(CONTAINER).length).toBe(2);

      injector.destroy();

      expect(document.querySelectorAll(CONTAINER).length).toBe(0);
    });
  });

  describe('server platform', () => {
    it('does not touch the document and returns a harmless handle', () => {
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      const createElement = spyOn(document, 'createElement').and.callThrough();

      const service = TestBed.inject(NgxToastifyService);
      for (const method of ['default', 'light', 'success', 'error', 'warning', 'info'] as const) {
        const handle = service[method](
          { title: 't' },
          { position: 'bottom-left', action: { label: 'x', onClick: () => undefined } }
        );
        expect(() => handle.update({ message: 'later', action: undefined })).not.toThrow();
      }

      expect(createElement).not.toHaveBeenCalled();
      expect(document.querySelectorAll(CONTAINER).length).toBe(0);
      expect(() => TestBed.resetTestingModule()).not.toThrow();
    });
  });

  describe('zone', () => {
    beforeEach(() => TestBed.configureTestingModule({ providers: [provideZoneChangeDetection()] }));

    @Component({
      selector: 'app-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<p id="count">{{ count() }}</p>`,
    })
    class HostComponent {
      readonly count = signal(0);
      private readonly toast = inject(NgxToastifyService);
      private readonly zone = inject(NgZone);

      showOutsideZone(): void {
        this.zone.runOutsideAngular(() =>
          this.toast.info(
            { title: 'Action' },
            { duration: 0, action: { label: 'Inc', onClick: () => this.count.update((c) => c + 1) } }
          )
        );
      }
    }

    it('runs action.onClick inside the NgZone, updating an OnPush host without detectChanges', async () => {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.autoDetectChanges();
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('#count')?.textContent).toBe('0');

      fixture.componentInstance.showOutsideZone();
      const button = document.querySelector<HTMLButtonElement>(ACTION)!;
      button.click();
      await fixture.whenStable();

      expect(fixture.componentInstance.count()).toBe(1);
      expect(el.querySelector('#count')?.textContent).toBe('1');
    });

    it('invokes the callback inside the Angular zone even when the toast was created outside it', () => {
      const service = TestBed.inject(NgxToastifyService);
      const zone = TestBed.inject(NgZone);
      let inZone: boolean | undefined;

      zone.runOutsideAngular(() =>
        service.info(
          { title: 'x' },
          { duration: 0, action: { label: 'Go', onClick: () => (inZone = NgZone.isInAngularZone()) } }
        )
      );
      document.querySelector<HTMLButtonElement>(ACTION)!.click();

      expect(inZone).toBeTrue();
    });

    it('also wraps an action supplied through handle.update()', () => {
      const service = TestBed.inject(NgxToastifyService);
      const zone = TestBed.inject(NgZone);
      let inZone: boolean | undefined;

      const handle = zone.runOutsideAngular(() => service.info({ title: 'x' }, { duration: 0 }));
      zone.runOutsideAngular(() =>
        handle.update({ action: { label: 'Late', onClick: () => (inZone = NgZone.isInAngularZone()) } })
      );
      document.querySelector<HTMLButtonElement>(ACTION)!.click();

      expect(inZone).toBeTrue();
    });
  });
});
