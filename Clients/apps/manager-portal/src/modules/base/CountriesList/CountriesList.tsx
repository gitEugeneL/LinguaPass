import { Button } from '@clients/shared';

import { EmptyCard, ItemCard } from '../../../componets';
import { StatusArea } from '../../../widgets';
import { KeyValueBlock } from '../../../widgets/StatusArea/UI';

import styles from './CountriesList.module.pcss';

export function CountriesList() {
  return (
    <>
      <StatusArea name='Countries'>
        <div className={styles.info}>
          <KeyValueBlock name='total' value='-1' />
          <KeyValueBlock name='active' value='-1' />
          <KeyValueBlock name='disabled' value='-1' />
        </div>
        <Button
          name='Create'
          size='small'
          onClick={() => {
            console.log('create');
          }}
        />
      </StatusArea>

      <div className={styles.container}>
        <ItemCard name='Examle' isActiveStatus={true} />
        <ItemCard name='Examle' isActiveStatus={true} />
        <ItemCard name='Examle' isActiveStatus={true} />
        <ItemCard name='Examle' isActiveStatus={true} />
        <ItemCard name='Examle' isActiveStatus={true} />
        <ItemCard name='Examle' isActiveStatus={false} />
        <ItemCard name='Examle' isActiveStatus={false} />

        <EmptyCard name='Create new country' onClick={() => console.log('create')} />
      </div>
    </>
  );
}
