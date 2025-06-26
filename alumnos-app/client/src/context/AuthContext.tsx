import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  nombre: string;
  email: string;
  rol?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Al cargar la app, lee token y usuario de localStorage
    const tokenLS = localStorage.getItem('token');
    const usuarioLS = localStorage.getItem('usuario');

    if (tokenLS && usuarioLS) {
      setToken(tokenLS);
      setUsuario(JSON.parse(usuarioLS));
    }
  }, []);

  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUsuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
