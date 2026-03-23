import React from 'react';
import styles from './SectionLayout.module.css';

interface SectionLayoutProps {
  children: React.ReactNode;
  reverse?: boolean;
  background?: string;
  maxWidth?: number;
}

export default function SectionLayout({
  children,
  reverse = false,
  background = '#000000',
  maxWidth = 1200,
}: SectionLayoutProps) {
  const childArray = React.Children.toArray(children);
  const [media, text] = childArray;

  return (
    <section className={styles.section} style={{ background }}>
      <div
        className={`${styles.inner}${reverse ? ` ${styles.reverse}` : ''}`}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <div className={styles.media}>{media}</div>
        <div className={styles.text}>{text}</div>
      </div>
    </section>
  );
}
