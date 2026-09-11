import { Injectable } from '@angular/core';

const TOKEN_KEY = 'jwtToken';

@Injectable({ providedIn: 'root' })
export class JwtService {

  getToken(): string | null {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  }

  saveToken(token: string) {
    if (token) {
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  destroyToken() {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }
}
