export interface AccountCardProps {
  routes: { name: string; to: string; order: number }[];
  toggleDrawer?: () => void;
}
