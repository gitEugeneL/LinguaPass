import { type ContactWidgetProps } from './ContactWidget.props.ts';
import { useContactStore } from '../../../../../store/contact/contact.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import ResultItem from '../../components/ResultItem/ResultItem.tsx';
import { type Contact } from '../../../../../store/contact/contact.models.ts';

export default function ContactWidget({ ...props }: ContactWidgetProps) {
  const { contact, isLoading, getCurrentContact } = useContactStore(
    useShallow((state) => ({
      contact: state.contact,
      isLoading: state.isLoading,
      getCurrentContact: state.getCurrentContact
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (props.opened && !contact && props.contactId) {
        await getCurrentContact();
      }
    };
    fetchData();
  }, [props.opened]);

  const getFields = () => {
    const fields: { title: string; key: keyof Contact }[] = [
      { title: 'Name:', key: 'name' },
      { title: 'Surname:', key: 'surname' },
      { title: 'Middle name:', key: 'middleName' },
      { title: 'Maiden name:', key: 'maidenName' },
      { title: 'Gender:', key: 'gender' },
      { title: 'Phone:', key: 'phone' },
      { title: 'Type of settlement:', key: 'typeOfSettlement' },
      { title: 'Street:', key: 'street' },
      { title: 'Hs/apt:', key: 'hsApt' },
      { title: 'City:', key: 'city' },
      { title: 'Country:', key: 'country' },
      { title: 'Postcode:', key: 'postcode' }
    ];
    if (contact?.corrStreet || contact?.corrCity) {
      fields.push(
        { title: 'Corr. street:', key: 'corrStreet' },
        { title: 'Corr. hs/apt:', key: 'corrHsApt' },
        { title: 'Corr. city:', key: 'corrCity' },
        { title: 'Corr. country:', key: 'corrCountry' },
        { title: 'Corr. postcode:', key: 'corrPostcode' }
      );
    }

    return fields;
  };

  return (
    <>
      {getFields().map(({ title, key }) => (
        <ResultItem
          key={key}
          title={title}
          body={props.contactId == null ? '-' : contact?.[key] || '-'}
          isLoading={isLoading}
        />
      ))}
    </>
  );
}
