export default [

  {
    name: 'Home',
    icon: 'fa fa-home',
    collapsed: false,
    children: [{
      name: 'Dashboard',
      icon: 'fa fa-tachometer',
      path: '/home/dashboard'
    }

    ]
  },
  {
    name: 'Plan',
    icon: 'fa fa-tasks',
    collapsed: false,
    children: [{
      name: 'Time',
      icon: 'fa fa-clock',
      path: '/plan/time'
    },
    {
      name: 'Income',
      icon: 'fa fa-dollar-sign',
      path: '/plan/income'
    },
    {
      name: 'Projects',
      icon: 'fa fa-project-diagram',
      path: '/plan/projects'
    }
    ]
  },
  {
    name: 'Act',
    icon: 'fa fa-file-alt',
    collapsed: false,
    children: [{
      name: 'Daily Dev Log',
      icon: 'fa fa-calendar-alt',
      path: '/act/dailydevlog'
    },
    {
      name: 'What I\'ve Read',
      icon: 'fa fa-book-reader',
      path: '/act/whatiread'
    },
    {
      name: 'Manager Access',
      icon: 'fa fa-thumbtack',
      path: '/act/manageraccess'
    }
    ]
  },
  {
    name: 'Grow',
    icon: 'fa fa-rocket',
    collapsed: false,
    children: [{
      name: 'Strengths & Opportunities',
      icon: 'fa fa-dumbbell',
      path: '/grow/strengthsopportunities'
    },
    {
      name: 'Current Focus',
      icon: 'fa fa-bullseye-arrow',
      path: '/grow/currentfocus'
    },
    {
      name: 'What to Read',
      icon: 'fa fa-book-open',
      path: '/grow/whattoread'
    },
    {
      name: 'Profile Editor',
      icon: 'fa fa-user-edit',
      path: '/grow/profileeditor'
    }
    ]
  },
  {
    name: 'Account',
    icon: 'fa fa-tasks',
    collapsed: false,
    children: [{
      name: 'Billing',
      icon: 'fa fa-money-bill-wave',
      path: '/account/billing'
    },
    {
      name: 'Profile',
      icon: 'fa fa-user-alt',
      path: '/account/profile'
    },
    {
      name: 'Affiliate',
      icon: 'fa fa-hands-helping',
      path: '/account/affiliate'
    },
      {
        name: 'Logout',
        icon: 'fa fa-sign-out',
        path: '/account/logout'
      },
      {
        name: 'Password Reset',
        icon: 'fa fa-unlock-alt',
        path: '/account/passwordreset'
      }
    ]
  },

]
