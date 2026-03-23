import PhoneFrame from '../PhoneFrame/PhoneFrame';
import portraitVolleyball from '../../assets/screenshots/portrait-volleyball-game.png';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgLeft} />
        <div className={styles.bgRight} />
      </div>
      <div className={styles.divider} />

      {/* Watermark */}
      <div className={styles.watermark}>
        <span className={styles.watermarkScore}>07</span>
        <div className={styles.watermarkSep} />
        <span className={styles.watermarkScore}>06</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.textCol}>
          <h1 className={styles.h1}>ScoreKeep</h1>
          <p className={styles.tagline}>
            The cleanest scorekeeping app for every sport.
          </p>
        </div>
        <div className={styles.phoneCol}>
          <PhoneFrame
            src={portraitVolleyball}
            alt="ScoreKeep portrait mode — volleyball game in progress"
            maxHeight={Math.min(540, typeof window !== 'undefined' ? window.innerHeight * 0.7 : 540)}
          />
        </div>
      </div>
    </section>
  );
}
