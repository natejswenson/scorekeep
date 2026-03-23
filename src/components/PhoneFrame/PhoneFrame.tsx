import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  src: string;
  alt: string;
  maxHeight?: number;
}

export default function PhoneFrame({ src, alt, maxHeight = 520 }: PhoneFrameProps) {
  return (
    <div
      className={styles.frame}
      style={{ maxHeight: `${maxHeight}px`, aspectRatio: '390 / 844' }}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
