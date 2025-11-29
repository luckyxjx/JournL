export class PWAService {
  private deferredPrompt: any = null;

  init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    });

    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    });
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}