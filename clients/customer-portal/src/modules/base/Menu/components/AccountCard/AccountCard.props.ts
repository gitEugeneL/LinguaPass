export interface AccountCardProps {
  statusOrder: number | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  toggleDrawer?: () => void;
  handleLogout: () => void;
}
