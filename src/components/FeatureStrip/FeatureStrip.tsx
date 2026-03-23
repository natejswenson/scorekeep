import styles from './FeatureStrip.module.css';

const features = [
  {
    icon: '⚽',
    label: 'Sports',
    value: 'Volleyball, Basketball, Football, Soccer',
  },
  {
    icon: '◆',
    label: 'Design',
    value: 'Clean & minimal — nothing in the way',
  },
  {
    icon: '⟳',
    label: 'Orientation',
    value: 'Portrait & Landscape, always crisp',
  },
  {
    icon: '◐',
    label: 'Themes',
    value: 'Five color themes, more coming',
  },
];

export default function FeatureStrip() {
  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        {features.map((f) => (
          <div key={f.label} className={styles.card}>
            <span className={styles.icon}>{f.icon}</span>
            <p className={styles.label}>{f.label}</p>
            <p className={styles.value}>{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
