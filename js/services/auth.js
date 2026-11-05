import { storage } from './storage.js';
import { USERS_DATA } from '../data/users.js';

const AUTH_USER_KEY = 'fz_auth_user';

class AuthService {
  constructor() {
    this.currentUser = storage.get(AUTH_USER_KEY, null);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getUserRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  /**
   * Inicia sesión buscando usuario por email o id
   */
  login(email, password = null) {
    const user = USERS_DATA.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      storage.set(AUTH_USER_KEY, user);
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales inválidas' };
  }

  /**
   * Inicio de sesión rápido para botones demo
   */
  loginAsDemo(role) {
    const user = USERS_DATA.find(u => u.role === role);
    if (user) {
      this.currentUser = user;
      storage.set(AUTH_USER_KEY, user);
      return { success: true, user };
    }
    return { success: false, error: `Usuario demo para rol "${role}" no encontrado` };
  }

  logout() {
    this.currentUser = null;
    storage.remove(AUTH_USER_KEY);
    return true;
  }

  /**
   * Guardián de rutas protegidas: verifica autenticación y rol requerido
   */
  requireAuth(allowedRoles = [], redirectUrl = '/pages/login.html') {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Acceso restringido: Esta sección requiere rol de ${allowedRoles.join(' o ')}.`);
      window.location.href = '/index.html';
      return false;
    }
    return true;
  }
}

export const auth = new AuthService();
