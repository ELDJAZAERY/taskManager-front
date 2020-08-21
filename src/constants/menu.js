const GLOBAL_MENU = [
  {
    id: 'Users',
    icon: 'iconsminds-mens',
    label: 'menu.users',
    to: '/app/dashboard/users',
    newWindow: false
  },
  {
    id: 'Tasks',
    icon: 'simple-icon-organization',
    label: 'menu.tasks',
    to: '/app/tasks',
    newWindow: false
  }
];

export const getMenuItems = () => {
  return GLOBAL_MENU;
};
