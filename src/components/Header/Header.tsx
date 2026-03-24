import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const links = [
  { label: 'Scoring', href: '#scoring' },
  { label: 'Sports', href: '#sports' },
  { label: 'Volleyball', href: '#volleyball' },
  { label: 'Menu', href: '#menu' },
  { label: 'Settings', href: '#settings' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>SetScore</a>
        <nav className={styles.nav}>
          {links.map(l => (
            <a key={l.href} href={l.href} className={styles.link}>{l.label}</a>
          ))}
        </nav>
        <a href="#" className={styles.cta}>Download</a>
      </div>
    </header>
  );
}
