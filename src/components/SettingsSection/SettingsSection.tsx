import PhoneFrame from '../PhoneFrame/PhoneFrame';
import settingsPng from '../../assets/screenshots/settings-screen.png';
import styles from './SettingsSection.module.css';

const groups = [
  {
    title: 'Appearance',
    body: 'Five themes: Classic (navy + crimson), Midnight (all-black), Teal & Fire, Violet & Gold, and Forest & Crimson. Each theme applies a gradient to both team halves.',
  },
  {
    title: 'Volleyball',
    body: 'Control Max Score, Auto-Advance, Best Of length (3/5/7), and Final Set Score without leaving the settings sheet.',
  },
  {
    title: 'Timer',
    body: 'Off by default. Count Up tracks elapsed time. Count Down starts a configurable countdown (1–120 minutes) and turns gold when time expires.',
  },
  {
    title: 'Display',
    body: 'Keep Screen On prevents the display from sleeping — useful on a tablet mounted courtside.',
  },
  {
    title: 'Haptic Feedback',
    body: 'Subtle vibrations confirm every tap. Toggle off for a silent experience.',
  },
];

export default function SettingsSection() {
  return (
    <section id="settings" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.media}>
          <PhoneFrame
            src={settingsPng}
            alt="SetScore settings — themes, volleyball, timer, display, haptics"
            maxHeight={560}
          />
        </div>
        <div className={styles.text}>
          <p className={styles.eyebrow}>Settings</p>
          <h2 className={styles.h2}>Set it up your way.</h2>
          <p className={styles.intro}>
            SetScore stays out of your way during play. When you need to configure something,
            Settings has it all in one place — open it from the menu.
          </p>
          <div className={styles.groups}>
            {groups.map(g => (
              <div key={g.title} className={styles.group}>
                <p className={styles.groupTitle}>{g.title}</p>
                <p className={styles.groupBody}>{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
