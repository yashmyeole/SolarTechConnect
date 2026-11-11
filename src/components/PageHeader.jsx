import styles from './PageHeader.module.css';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h1 className="h1">{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className="row row-wrap gap-8">{actions}</div>}
    </div>
  );
}
