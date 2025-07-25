import style from './AdminCard.module.pcss';
import type { AdminCardProps } from './AdminCard.props.ts';

export function AdminCard({ ...props }: AdminCardProps) {
  return (
    <div className={style.container}>
      <div className={style.line} />

      <ul>{props.children}</ul>

      <div className={style.wrapper}>
        <div className={style.symbol}>{props.email.slice(0, 2).toUpperCase()}</div>

        <div className={style.infoWrapper}>
          <div className={style.name}>Manager</div>
          <div className={style.email}>{props.email}</div>
        </div>
      </div>
    </div>
  );
}
