import React, { useState, useContext } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Función para cerrar sesión y redirigir
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: menuOpen ? 200 : 60,
          backgroundColor: "#2c3e50",
          color: "#fff",
          transition: "width 0.3s",
          overflow: "hidden",
          boxShadow: menuOpen ? "2px 0 5px rgba(0,0,0,0.1)" : "none",
          borderRadius: menuOpen ? "0 8px 8px 0" : "0",
        }}
      >
        {/* Botón Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            padding: 15,
            width: "100%",
            cursor: "pointer",
            fontSize: 22,
            textAlign: menuOpen ? "left" : "center",
            userSelect: "none",
            outline: "none",
          }}
          aria-label="Toggle menu"
          title={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          ☰
        </button>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            { to: "/dashboard", label: "Dashboard", icon: "🏠" },
            { to: "/alumnos", label: "Usuarios", icon: "👥" },
            { to: "/mensajes", label: "Mensajes", icon: "✉️" },
            { to: "/estudiantes", label: "Estudiantes", icon: "🎓" },
          ].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  color: "white",
                  textDecoration: "none",
                  background: location.pathname.startsWith(item.to)
                    ? "#34495e"
                    : "transparent",
                  borderRadius: 6,
                  gap: menuOpen ? 10 : 0,
                  justifyContent: menuOpen ? "flex-start" : "center",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {menuOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón Cerrar Sesión */}
        {menuOpen && (
          <button
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              marginBottom: 20,
              marginLeft: 20,
              padding: "10px 15px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              width: "calc(100% - 40px)",
              userSelect: "none",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
          >
            Cerrar sesión
          </button>
        )}
      </nav>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: 24, backgroundColor: "#f4f6f8" }}>
        {/* Breadcrumbs */}
        <nav
          aria-label="breadcrumb"
          style={{
            marginBottom: 20,
            fontSize: 14,
            color: "#555",
          }}
        >
          <ol
            style={{
              listStyle: "none",
              display: "flex",
              gap: 8,
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              <Link to="/" style={{ color: "#3498db", textDecoration: "none" }}>
                Inicio
              </Link>
              <span> / </span>
            </li>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return (
                <li key={routeTo}>
                  {!isLast ? (
                    <>
                      <Link
                        to={routeTo}
                        style={{ color: "#3498db", textDecoration: "none" }}
                      >
                        {name}
                      </Link>
                      <span> / </span>
                    </>
                  ) : (
                    <span style={{ color: "#333" }}>{name}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            minHeight: "80vh",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
