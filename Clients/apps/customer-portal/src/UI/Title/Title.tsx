import styles from './Title.module.pcss';
import { type TitleProps } from './Title.props.ts';
import cn from 'classnames';

export default function Title({
  title,
  subTitle = undefined,
  description = undefined,
  appearance = 'secondary'
}: TitleProps) {
  return (
    <div
      className={cn(styles.wrapper, {
        [styles.mainWrapper]: appearance === 'main' || appearance == 'primary'
      })}
    >
      {subTitle && <span className={styles.subtitle}>{subTitle}</span>}

      <h1
        className={cn(styles.title, {
          [styles.mainTitle]: appearance === 'main',
          [styles.secondaryTitle]: appearance === 'secondary',
          [styles.primaryTitle]: appearance === 'primary'
        })}
      >
        {title}
      </h1>

      {description && (
        <p
          className={cn(styles.description, {
            [styles.mainDescription]: appearance === 'main',
            [styles.secondaryDescription]: appearance === 'secondary'
          })}
        >
          {description}
        </p>
      )}
    </div>
  );
}
