const GLOBAL_MENU = [
  {
    id: 'Clients',
    icon: 'iconsminds-mens',
    label: 'menu.clients',
    to: '/app/dashboard/users',
    newWindow: false
  }
];

export const getMenuItems = () => {
  return GLOBAL_MENU;
};
