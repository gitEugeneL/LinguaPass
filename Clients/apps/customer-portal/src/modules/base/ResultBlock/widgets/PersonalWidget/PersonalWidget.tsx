import { dateToShortString } from '@clients/shared';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { usePersonalStore } from '../../../../../store';
import { type Personal } from '../../../../../store/personal/personal.models.ts';
import { ResultItem } from '../../components';

import { type PersonalWidgetProps } from './PersonalWidget.props.ts';

export function PersonalWidget({ ...props }: PersonalWidgetProps) {
  const { personal, isLoading, getCurrentPersonal } = usePersonalStore(
    useShallow((state) => ({
      personal: state.personal,
      isLoading: state.isLoading,
      getCurrentPersonal: state.getCurrentPersonal
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (props.opened && !personal && props.personalId) {
        await getCurrentPersonal();
      }
    };
    fetchData();
  }, [props.opened]);

  const getFields = () => {
    const fields: { title: string; key: keyof Personal }[] = [
      { title: 'Father’s name:', key: 'fathersName' },
      { title: 'Mother’s name:', key: 'mothersName' },
      { title: 'Birthday:', key: 'birthday' },
      { title: 'Birth place:', key: 'birthPlace' },
      { title: 'Country of birth:', key: 'countryOfBirth' },
      { title: 'Nationality:', key: 'nationality' },
      { title: 'Education level:', key: 'educationLevel' },
      { title: 'ID number:', key: 'idNumber' },
      { title: 'Country of issue', key: 'countryOfIssue' },
      { title: 'Contact name', key: 'contactName' },
      { title: 'Contact surname', key: 'contactSurname' },
      { title: 'Relationship', key: 'relationship' },
      { title: 'Contact phone', key: 'contactPhone' }
    ];
    return fields;
  };

  return (
    <>
      {getFields().map(({ title, key }) => (
        <ResultItem
          key={key}
          title={title}
          body={
            props.personalId == null
              ? '-'
              : key === 'birthday'
                ? dateToShortString(personal?.[key])
                : personal?.[key] || '-'
          }
          isLoading={isLoading}
        />
      ))}
    </>
  );
}
