import styles from './ScoringSection.module.css';

const gestures = [
  {
    gesture: 'Tap',
    action: 'Add a point',
    detail: 'Tap anywhere on your team\'s half of the screen. Volleyball and soccer add 1 point. Basketball and football add your selected chip value.',
    icon: '↑',
  },
  {
    gesture: 'Long Press',
    action: 'Remove a point',
    detail: 'Hold your team\'s half for ~0.5 seconds. Volleyball and soccer remove 1. Basketball and football remove the last amount scored.',
    icon: '↓',
  },
  {
    gesture: 'Swipe Down',
    action: 'Open menu',
    detail: 'Swipe down anywhere on the game screen to open the menu — switch sports, start a new game, view history, and access settings.',
    icon: '≡',
  },
];

export default function ScoringSection() {
  return (
    <section id="scoring" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>How to Play</p>
          <h2 className={styles.h2}>Three gestures. That's it.</h2>
          <p className={styles.subtitle}>
            ScoreKeep is built around the idea that you should never have to look away from the game.
            Every action is a single gesture.
          </p>
        </div>
        <div className={styles.grid}>
          {gestures.map(g => (
            <div key={g.gesture} className={styles.card}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{g.icon}</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.gesture}>{g.gesture}</p>
                <p className={styles.action}>{g.action}</p>
                <p className={styles.detail}>{g.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
