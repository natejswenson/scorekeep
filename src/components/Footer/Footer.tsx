import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>SetScore</p>
      <p className={styles.copy}>© 2026 SetScore. All rights reserved.</p>
    </footer>
  );
}
