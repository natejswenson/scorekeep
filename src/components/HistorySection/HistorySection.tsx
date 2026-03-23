import styles from './HistorySection.module.css';

const items = [
  <>Every game is saved with team names, date, time, and final score.</>,
  <>
    <strong>Volleyball games</strong> show the total sets won. Tap any volleyball row to expand it
    and see the score from each individual set.
  </>,
  <>
    <strong>Swipe left</strong> on any row to delete that game.
  </>,
  <>
    <strong>Clear All</strong> in the top-right removes the full history for the current sport.
  </>,
  <>History is tracked per sport. Switch sports in the menu to view records for that sport.</>,
];

export default function HistorySection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.h2}>Every game remembered.</h2>
        <p className={styles.intro}>
          ScoreKeep saves every game automatically as you play — nothing to confirm, nothing to
          remember. Open History from the menu at any time to see the full record.
        </p>
        <ul className={styles.list}>
          {items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              <span className={styles.bullet}>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
