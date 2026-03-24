import PhoneFrame from '../PhoneFrame/PhoneFrame';
import menuDrawer from '../../assets/screenshots/menu-drawer.png';
import styles from './MenuSection.module.css';

const menuItems = [
  {
    icon: '⚽',
    label: 'Sport',
    desc: 'Switch between Volleyball, Basketball, Football, and Soccer. History is tracked per sport.',
  },
  {
    icon: '↺',
    label: 'New Game',
    desc: 'Reset scores and start fresh. A brief undo toast lets you reverse an accidental tap.',
  },
  {
    icon: '📋',
    label: 'History',
    desc: "Every game saved automatically. Volleyball games expand to show per-set scores.",
  },
  {
    icon: '？',
    label: 'Help',
    desc: 'Opens the in-app tutorial — good for first-time users or when trying a new sport.',
  },
  {
    icon: '⚙',
    label: 'Settings',
    desc: 'Themes, volleyball rules, timer, display, and haptic options.',
  },
];

export default function MenuSection() {
  return (
    <section id="menu" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.media}>
          <PhoneFrame
            src={menuDrawer}
            alt="SetScore menu open — Sport, New Game, History, Help, Settings"
            maxHeight={520}
          />
        </div>
        <div className={styles.text}>
          <p className={styles.eyebrow}>Menu</p>
          <h2 className={styles.h2}>Everything in one swipe.</h2>
          <p className={styles.intro}>
            Swipe down anywhere on the game screen. No hamburger button, no navigation bar —
            just a natural gesture that keeps the scoring interface completely clean.
          </p>
          <div className={styles.menuList}>
            {menuItems.map(item => (
              <div key={item.label} className={styles.menuRow}>
                <span className={styles.rowIcon}>{item.icon}</span>
                <div className={styles.rowContent}>
                  <p className={styles.rowLabel}>{item.label}</p>
                  <p className={styles.rowDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
