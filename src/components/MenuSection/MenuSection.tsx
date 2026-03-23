import SectionLayout from '../SectionLayout/SectionLayout';
import PhoneFrame from '../PhoneFrame/PhoneFrame';
import menuOpen from '../../assets/screenshots/menu-open.png';
import styles from './MenuSection.module.css';

const menuItems = [
  {
    icon: '🏐',
    label: 'Sport',
    desc: 'Switch between Volleyball, Basketball, Football, and Soccer. Scores and history are tracked independently per sport.',
  },
  {
    icon: '↺',
    label: 'New Game',
    desc: 'Reset all scores and start fresh. A brief undo toast lets you reverse an accidental tap.',
  },
  {
    icon: '📋',
    label: 'History',
    desc: "Every game you've played, saved automatically. Volleyball games are expandable to show per-set scores.",
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
    <SectionLayout reverse background="#111111">
      <PhoneFrame
        src={menuOpen}
        alt="ScoreKeep menu open — showing Sport, New Game, History, Help, Settings"
        maxHeight={500}
      />
      <div>
        <h2 className={styles.h2}>Everything in one swipe.</h2>
        <p className={styles.intro}>
          Swipe down anywhere on the game screen to open the menu. No hamburger button, no
          navigation bar — just a natural gesture that keeps the scoring interface completely clean.
        </p>
        <div className={styles.menuList}>
          {menuItems.map((item) => (
            <div key={item.label} className={styles.menuRow}>
              <span className={styles.rowIcon}>{item.icon}</span>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>{item.label}</p>
                <p className={styles.rowDesc}>{item.desc}</p>
              </div>
              <span className={styles.chevron}>›</span>
            </div>
          ))}
        </div>
        <p className={styles.timerNote}>
          <strong>Timer:</strong> When a timer is enabled in Settings, a live clock row appears at
          the top of the menu. Tap to pause or resume; long-press to reset. Count Down turns gold
          when expired.
        </p>
      </div>
    </SectionLayout>
  );
}
