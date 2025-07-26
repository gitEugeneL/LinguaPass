import { useNavigate } from 'react-router';

import style from './BackButton.module.pcss';
import { BackIcon } from './icons/BackIcon.tsx';

export function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className={style.btn} onClick={handleClick}>
      <BackIcon />
    </div>
  );
}
