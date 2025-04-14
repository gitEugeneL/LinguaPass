import style from './CourseCard.module.pcss';
import Button from '../../../../../UI/Button/Button.tsx';

export default function CourseCard() {
  return (
    <li className={style.card}>
      <div className={style.info}>
        <div className={style.infoWrapper}>
          <div>
            <div className={style.infoText}>
              Location:<span className={style.infoContent}>Warsaw</span>
            </div>
            <div className={style.infoText}>
              Duration:<span className={style.infoContent}>3 years</span>
            </div>
            <div className={style.infoText}>
              Accommodation:<span className={style.infoContent}>Yes</span>
            </div>
          </div>
          <div>
            <div className={style.infoText}>
              Admission fee:<span className={style.infoContent}>200€</span>
            </div>
            <div className={style.infoText}>
              Price from:<span className={style.infoContent}>3800€</span>
            </div>
          </div>
        </div>
        <div className={style.btn}>
          <Button name='Apply online' appearance='special' size='large' />
        </div>
      </div>
      <div className={style.main}>
        <div className={style.mainWrapper}>
          <h2 className={style.name}>Super english courses</h2>
          <span className={style.school}>Warsaw school of languages</span>
          <span className={style.type}>English language</span>
        </div>

        <p className={style.description}>
          There are many variations of passages of Lorem Ipsum available. Hgsfsg jahsvba hdhckh dgjc
          js but the majority have suffered alteration in some form. There are many variations of
          passages of Lorem Ipsum available but the majority have suffered alteration in some form.
          but the majority have suffered alteration in some form. ty have suffered alteration in
          some form. but the majority have suffered alteration in some form.
        </p>

        <p className={style.activities}>
          <span className={style.activitiesTitle}>Activities: </span>Economy of Millionaires, Global
          Economy, Green Economy, Transport Economics and Logistic, E-Commerce Business
        </p>
      </div>
    </li>
  );
}
