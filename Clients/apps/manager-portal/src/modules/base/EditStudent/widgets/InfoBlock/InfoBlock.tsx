import { ArrowIcon } from '@clients/shared';
import cn from 'classnames';
import { useState } from 'react';

import { useStudentStore } from '../../../../../store';
import { InfoItem } from '../components';

import styles from './InfoBlock.module.pcss';

export function InfoBlock() {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const studentDetail = useStudentStore((state) => state.studentDetail);
  const handleClick = () => setIsOpened(!isOpened);

  return (
    <div
      className={cn(styles.container, {
        [styles.openedContainer]: isOpened
      })}
      onClick={handleClick}
    >
      <div className={styles.nameWrapper}>
        <h3 className={styles.title}>Detail information</h3>

        <div
          className={cn(styles.arrow, {
            [styles.openedArrow]: isOpened
          })}
        >
          <ArrowIcon width={25} height={25} />
        </div>
      </div>

      <div
        className={cn(styles.contentWrapper, {
          [styles.openedContentWrapper]: isOpened
        })}
      >
        <ul
          className={cn(styles.bodyWrapper, {
            [styles.bodyWrapperOpened]: isOpened
          })}
        >
          <InfoItem title='Name:' value={studentDetail?.contact?.name || '-'} />
          <InfoItem title='Surname:' value={studentDetail?.contact?.surname || '-'} />
          <InfoItem title='MiddleName:' value={studentDetail?.contact?.middleName || '-'} />
          <InfoItem title='MaidenName:' value={studentDetail?.contact?.maidenName || '-'} />
          <InfoItem title='Gender:' value={studentDetail?.contact?.gender || '-'} />
          <InfoItem title='Phone:' value={studentDetail?.contact?.phone || '-'} />
          <InfoItem
            title='Type of settlement:'
            value={studentDetail?.contact?.typeOfSettlement || '-'}
          />
          <InfoItem title='Street:' value={studentDetail?.contact?.street || '-'} />
          <InfoItem title='Hs/apt:' value={studentDetail?.contact?.hsApt || '-'} />
          <InfoItem title='City:' value={studentDetail?.contact?.city || '-'} />
          <InfoItem title='Country:' value={studentDetail?.contact?.country || '-'} />
          <InfoItem title='Postcode:' value={studentDetail?.contact?.postcode || '-'} />
          {studentDetail?.contact?.corrCity && (
            <>
              <InfoItem title='Corr. street:' value={studentDetail?.contact?.corrStreet || '-'} />
              <InfoItem title='Corr. hs/apt:' value={studentDetail?.contact?.corrHsApt || '-'} />
              <InfoItem title='Corr. city:' value={studentDetail?.contact?.corrCity || '-'} />
              <InfoItem title='Corr. country:' value={studentDetail?.contact?.corrCountry || '-'} />
              <InfoItem
                title='Corr. postcode:'
                value={studentDetail?.contact?.corrPostcode || '-'}
              />
            </>
          )}
          <InfoItem title='Father’s name:' value={studentDetail?.personal?.fathersName || '-'} />
          <InfoItem title='Mother’s name:' value={studentDetail?.personal?.mothersName || '-'} />
          <InfoItem
            title='Birthday::'
            value={studentDetail?.personal?.birthday.toString() || '-'}
          />
          <InfoItem title='Birth place::' value={studentDetail?.personal?.birthPlace || '-'} />
          <InfoItem
            title='Country of birth::'
            value={studentDetail?.personal?.countryOfBirth || '-'}
          />
          <InfoItem title='Nationality:' value={studentDetail?.personal?.nationality || '-'} />
          <InfoItem
            title='Education level::'
            value={studentDetail?.personal?.educationLevel || '-'}
          />
          <InfoItem title='ID number::' value={studentDetail?.personal?.idNumber || '-'} />
          <InfoItem
            title='Country of issue:'
            value={studentDetail?.personal?.countryOfIssue || '-'}
          />
          <InfoItem title='Contayct name:' value={studentDetail?.personal?.contactName || '-'} />
          <InfoItem
            title='Contact surname:'
            value={studentDetail?.personal?.contactSurname || '-'}
          />
          <InfoItem title='Relationship:' value={studentDetail?.personal?.relationship || '-'} />
          <InfoItem title='Contact phone:' value={studentDetail?.personal?.contactPhone || '-'} />
        </ul>
      </div>
    </div>
  );
}
