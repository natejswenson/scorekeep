import SectionLayout from '../SectionLayout/SectionLayout';
import PhoneFrame from '../PhoneFrame/PhoneFrame';
import portraitVolleyball from '../../assets/screenshots/portrait-volleyball-game.png';
import styles from './HowToScore.module.css';

export default function HowToScore() {
  return (
    <SectionLayout background="#000000">
      <PhoneFrame
        src={portraitVolleyball}
        alt="ScoreKeep portrait mode — volleyball game in progress"
        maxHeight={500}
      />
      <div>
        <h2 className={styles.h2}>Scoring is as simple as it gets.</h2>
        <p className={styles.body}>
          <strong>Tap anywhere on your side</strong> to add a point. The entire half of the screen
          is your scoring zone — no tiny buttons to aim for.
        </p>
        <p className={styles.body}>
          <strong>Made a mistake?</strong> Tap the − circle at the bottom of your side to subtract
          one point. It fades out when the score is already 0 so you always know it's safe to use.
        </p>

        <h3 className={styles.subheading}>Basketball &amp; Football</h3>
        <p className={styles.body}>
          Before tapping your side, choose a point value from the chip panel at the center of the
          screen. Basketball chips are labeled <strong>3</strong>, <strong>2</strong>, and{' '}
          <strong>1</strong>. Football chips are <strong>6</strong>, <strong>3</strong>,{' '}
          <strong>2</strong>, and <strong>1</strong>. Tap a chip to select it — it lights up to
          confirm your choice — then tap your side to score that value. Your selection stays active
          until you change it.
        </p>

        <h3 className={styles.subheading}>Volleyball &amp; Soccer</h3>
        <p className={styles.body}>Every tap scores exactly 1 point. No chip selection needed.</p>

        <h3 className={styles.subheading}>Rename teams</h3>
        <p className={styles.body}>
          Tap any team name at the top of its half to rename it. Names save automatically and appear
          in game history.
        </p>
      </div>
    </SectionLayout>
  );
}
