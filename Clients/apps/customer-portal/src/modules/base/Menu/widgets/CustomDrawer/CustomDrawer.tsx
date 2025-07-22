import 'react-modern-drawer/dist/index.css';
import styles from './CustomDrawer.module.pcss';
import { type CustomDrawerProps } from './CustomDrawer.props.ts';
import { CloseIcon } from '@clients/shared';
import Drawer from 'react-modern-drawer';

export default function CustomDrawer({ children, ...props }: CustomDrawerProps) {
  return (
    <div className={styles.container}>
      <Drawer
        open={props.isDrawerOpened}
        onClose={props.toggleDrawer}
        direction='left'
        size='80%'
        style={{ backgroundColor: '#F1F5F9' }}
        overlayColor={'rgba(43, 42, 58, 0.9)'}
        overlayOpacity={0.9}
        className={styles.drawer}
      >
        <div className={styles.closeButton} onClick={props.toggleDrawer}>
          <CloseIcon />
        </div>

        <div className={styles.context}>{children}</div>
      </Drawer>
    </div>
  );
}
