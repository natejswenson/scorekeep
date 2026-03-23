import SectionLayout from '../SectionLayout/SectionLayout';
import landscapeVolleyball from '../../assets/screenshots/landscape-volleyball-game.png';
import styles from './VolleyballSection.module.css';

const features = [
  {
    title: 'Sets tracked automatically',
    desc: 'Every time a team wins a set, their WINS counter increments and both scores reset to zero. No mid-game configuration needed.',
  },
  {
    title: 'NEXT SET button',
    desc: 'A circular hold-to-confirm button sits at the center divider. Hold it for about a second — the progress ring fills — and the set advances. The hold requirement prevents accidental taps in the heat of a game.',
  },
  {
    title: 'Auto-Advance',
    desc: 'Turn on Auto-Advance in Settings → Volleyball, and the app will detect win-by-two conditions and prompt you automatically. Never miss a set transition.',
  },
  {
    title: 'Best Of 3, 5, or 7',
    desc: 'Set the match length in Settings. The app tracks set wins and shows a Match Won overlay — winner\'s name in gold, dark backdrop — when one team clinches. Tap New Match to start over.',
  },
  {
    title: 'Final Set Score',
    desc: 'The deciding set uses its own score cap, configurable from 5 to 30 (default 15). Win-by-two always applies.',
  },
];

export default function VolleyballSection() {
  return (
    <SectionLayout background="#000000">
      <img
        src={landscapeVolleyball}
        alt="ScoreKeep landscape mode — volleyball game in progress"
        className={styles.landscapeImg}
        loading="lazy"
      />
      <div>
        <h2 className={styles.h2}>Built for volleyball.</h2>
        <p className={styles.intro}>
          Volleyball has rules that most scorekeeper apps ignore. ScoreKeep handles every detail —
          sets, win-by-two, deciding set scoring, and full match tracking — so you can focus on the
          game.
        </p>
        <div className={styles.featureList}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
