import PhoneFrame from '../PhoneFrame/PhoneFrame';
import sportSelector from '../../assets/screenshots/sport-selector.png';
import styles from './SportsSection.module.css';

const sports = [
  {
    name: 'Volleyball',
    detail: 'Sets, win-by-two, auto-advance, Best Of 3/5/7',
    color: '#3b75e9',
  },
  {
    name: 'Basketball',
    detail: 'Chip scoring — 1, 2, or 3 pts per tap',
    color: '#e97b3b',
  },
  {
    name: 'Football',
    detail: 'Chip scoring — 2, 3, 6, 7, or 8 pts per tap',
    color: '#3be97b',
  },
  {
    name: 'Soccer',
    detail: '1 point per tap, clean and minimal',
    color: '#e93b75',
  },
];

export default function SportsSection() {
  return (
    <section id="sports" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>Multi-Sport</p>
          <h2 className={styles.h2}>One app. Four sports.</h2>
          <p className={styles.subtitle}>
            Switch sports from the menu in seconds. Scores, history, and settings are tracked
            independently per sport — so your volleyball streak stays intact when you switch to
            basketball.
          </p>
          <div className={styles.sportGrid}>
            {sports.map(s => (
              <div key={s.name} className={styles.sportCard}>
                <span className={styles.dot} style={{ background: s.color }} />
                <div>
                  <p className={styles.sportName}>{s.name}</p>
                  <p className={styles.sportDetail}>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.media}>
          <PhoneFrame
            src={sportSelector}
            alt="SetScore sport selector — volleyball, basketball, football, soccer"
            maxHeight={520}
          />
        </div>
      </div>
    </section>
  );
}
