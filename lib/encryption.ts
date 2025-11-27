export class EncryptionService {
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new Uint8Array(salt), iterations: 100000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  }

  async encrypt(text: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = new Uint8Array(crypto.getRandomValues(new Uint8Array(16)));
    const iv = new Uint8Array(crypto.getRandomValues(new Uint8Array(12)));
    const key = await this.deriveKey(password, salt);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, encoder.encode(text)
    );
    
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const salt = new Uint8Array(data.slice(0, 16));
    const iv = new Uint8Array(data.slice(16, 28));
    const encrypted = data.slice(28);
    
    const key = await this.deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, key, encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
}