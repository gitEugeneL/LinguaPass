import style from './CourseCard.module.pcss';
import Button from '../../../../../UI/Button/Button.tsx';
import { CourseCardProps } from './CourseCard.props.ts';

export default function CourseCard({ ...props }: CourseCardProps) {
  const handleCLick = () => {
    props.handleChoose(props.courseId);
  };

  return (
    <li className={style.card}>
      <div className={style.info}>
        <div className={style.infoWrapper}>
          <div>
            <div className={style.infoText}>
              Location:<span className={style.infoContent}>{props.location}</span>
            </div>
            <div className={style.infoText}>
              Duration:<span className={style.infoContent}>{props.duration}</span>
            </div>
            <div className={style.infoText}>
              Accommodation:
              <span className={style.infoContent}>{props.withAccommodation ? 'yes' : 'no'}</span>
            </div>
          </div>
          <div>
            <div className={style.infoText}>
              Admission fee:<span className={style.infoContent}>{props.admissionFee}€</span>
            </div>
            <div className={style.infoText}>
              Price from:<span className={style.infoContent}>{props.price}€</span>
            </div>
          </div>
        </div>
        <div className={style.btn}>
          <Button name='Apply online' appearance='special' size='large' onClick={handleCLick} />
        </div>
      </div>
      <div className={style.main}>
        <div className={style.mainWrapper}>
          <h2 className={style.name}>{props.name}</h2>
          <span className={style.school}>{props.schoolName}</span>
          <span className={style.type}>{props.languageName}</span>
        </div>

        <p className={style.description}>{props.description}</p>

        <p className={style.activities}>
          <span className={style.activitiesTitle}>Activities: </span>Economy of Millionaires, Global
          {props.activities}
        </p>
      </div>
    </li>
  );
}
