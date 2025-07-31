import { BackButton } from '../../componets';

import style from './StatusArea.module.pcss';
import type { StatusAreaProps } from './StatusArea.props.ts';

export function StatusArea({ name, children }: StatusAreaProps) {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.nameWrapper}>
          <BackButton />
          <p className={style.name}>{name}</p>
        </div>

        <div className={style.content}>{children}</div>
      </div>
    </div>
  );
}
