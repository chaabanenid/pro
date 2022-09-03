import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "MENUITEMS.DASHBOARDS.TEXT",
    icon: "bx-home-circle",
    badge: {
      variant: "info",
      text: "MENUITEMS.DASHBOARDS.BADGE",
    },
    link: "/dashboard",
    subItems: [
      // {
      //     id: 3,
      //     label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
      //     link: '/dashboard',
      //     parentId: 2
      // },
      // {
      //     id: 4,
      //     label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
      //     link: '/dashboards/saas',
      //     parentId: 2
      // },
      // {
      //     id: 5,
      //     label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
      //     link: '/dashboards/crypto',
      //     parentId: 2
      // },
      // {
      //     id: 6,
      //     label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
      //     link: '/dashboards/blog',
      //     parentId: 2
      // },
    ],
  },
  {
    id: 7,
    isLayout: true,
  },
  {
    id: 8,
    label: "MENUITEMS.APPS.TEXT",
    isTitle: true,
  },
 
  {
    id: 12,
    label: "MAlware reports",
    icon: "bx-store",
    subItems: [
     
      {
        id: 18,
        label: "Malware report",
        link: "/report/add",
        parentId: 12,
      },
      {
        id: 19,
        label: "List reports",
        link: "/report/list",
        parentId: 12,
      },
      
    
    ],
  },
 
];
