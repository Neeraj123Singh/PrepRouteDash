import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PreprouteLogo } from '../brand/PreprouteLogo';
import { useAuthStore } from '../../store/authStore';
import styles from './AppLayout.module.css';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: '▦' },
  { path: '/tests/new', label: 'Test Creation', icon: '✎', match: '/tests' },
  { path: '/dashboard', label: 'Test Tracking', icon: '◎' },
];

function isNavActive(path: string, match: string | undefined, location: string) {
  if (match) return location.startsWith(match);
  return location === path || location.startsWith(`${path}/`);
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || user?.userId || 'Admin';

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={styles.menuToggle}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        ☰
      </button>

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <Link to="/dashboard" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <PreprouteLogo size="md" />
        </Link>
        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = isNavActive(item.path, item.match, location.pathname);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={active ? styles.navActive : styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className={styles.mainWrap}>
        <header className={styles.topBar}>
          <div className={styles.topBarSpacer} />
          <div className={styles.userArea}>
            <button type="button" className={styles.bell} aria-label="Notifications">
              🔔
              <span className={styles.bellDot} />
            </button>
            <div className={styles.profile}>
              <span className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</span>
              <div className={styles.profileText}>
                <span className={styles.profileName}>{displayName}</span>
                <span className={styles.profileRole}>Admin</span>
              </div>
              <span className={styles.chevron}>▾</span>
            </div>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
