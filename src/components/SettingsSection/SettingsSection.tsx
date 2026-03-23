import SectionLayout from '../SectionLayout/SectionLayout';
import PhoneFrame from '../PhoneFrame/PhoneFrame';
import settingsPng from '../../assets/screenshots/settings.png';
import styles from './SettingsSection.module.css';

const themes = [
  { name: 'Classic', left: ['#3b75e9', '#0e1e4a'], right: ['#f32727', '#460808'] },
  { name: 'Midnight', left: ['#2c2c2e', '#000000'], right: ['#3a3a3c', '#0a0a0a'] },
  { name: 'Teal & Fire', left: ['#0d9488', '#042f2e'], right: ['#ea580c', '#431407'] },
  { name: 'Violet & Gold', left: ['#7c3aed', '#1e0a4a'], right: ['#d97706', '#431e00'] },
  { name: 'Forest & Crimson', left: ['#15803d', '#052e16'], right: ['#be123c', '#4c0519'] },
];

export default function SettingsSection() {
  return (
    <SectionLayout reverse background="#000000">
      <PhoneFrame
        src={settingsPng}
        alt="ScoreKeep settings — themes, volleyball, timer, display, haptics"
        maxHeight={560}
      />
      <div>
        <h2 className={styles.h2}>Set it up your way.</h2>
        <p className={styles.intro}>
          ScoreKeep is designed to stay out of your way — but when you need to configure something,
          Settings has it all in one place. Open it from the menu.
        </p>

        <div className={styles.groups}>
          <div className={styles.group}>
            <p className={styles.groupTitle}>Appearance — Five themes</p>
            <p className={styles.groupBody}>
              Classic keeps the look you know: deep navy blue and dark crimson red. Midnight goes
              all-black for the most minimal look. Teal &amp; Fire, Violet &amp; Gold, and Forest
              &amp; Crimson offer bolder palettes for teams with strong colors.
            </p>
            <table className={styles.themeTable}>
              <thead>
                <tr>
                  <th>Theme</th>
                  <th>Left (team 1)</th>
                  <th>Right (team 2)</th>
                </tr>
              </thead>
              <tbody>
                {themes.map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td>
                      <span
                        className={styles.swatch}
                        style={{
                          background: `linear-gradient(to right, ${t.left[0]}, ${t.left[1]})`,
                        }}
                      />
                    </td>
                    <td>
                      <span
                        className={styles.swatch}
                        style={{
                          background: `linear-gradient(to right, ${t.right[0]}, ${t.right[1]})`,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.group}>
            <p className={styles.groupTitle}>Volleyball</p>
            <p className={styles.groupBody}>
              Control Max Score (score turns gold when reached — set to 0 to disable), Auto-Advance,
              Best Of length, and Final Set Score without leaving the settings sheet.
            </p>
          </div>

          <div className={styles.group}>
            <p className={styles.groupTitle}>Timer</p>
            <p className={styles.groupBody}>
              Off by default. <strong>Count Up</strong> tracks elapsed time from the moment each
              game begins. <strong>Count Down</strong> starts a configurable countdown (1–120
              minutes) and turns gold when time expires. The timer appears in the menu when active.
            </p>
          </div>

          <div className={styles.group}>
            <p className={styles.groupTitle}>Display</p>
            <p className={styles.groupBody}>
              Keep Screen On prevents the display from sleeping during a game — useful on a tablet
              mounted courtside.
            </p>
          </div>

          <div className={styles.group}>
            <p className={styles.groupTitle}>Haptic Feedback</p>
            <p className={styles.groupBody}>
              Subtle vibrations confirm every tap and scoring event. Toggle off for a silent
              experience.
            </p>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
