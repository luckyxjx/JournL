import { supabase } from './services/supabase/client';

export class AuthFlows {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  async signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  enableGuestMode() {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('guestUserId', guestId);
    return { user: { id: guestId, email: null }, session: null };
  }

  isGuestMode(): boolean {
    return localStorage.getItem('guestMode') === 'true';
  }

  getGuestUserId(): string | null {
    return localStorage.getItem('guestUserId');
  }

  async signOut(keepLocalData = false) {
    if (!keepLocalData) {
      localStorage.clear();
    } else {
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestUserId');
    }
    
    if (!this.isGuestMode()) {
      await supabase.auth.signOut();
    }
  }
}