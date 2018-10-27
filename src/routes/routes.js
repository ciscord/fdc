import DashboardLayout from '../components/Common/Layout/DashboardLayout.vue'

import Authenticator from 'src/components/Home/Authenticator.vue'
import PasswordReset from 'src/components/Home/PasswordReset.vue'
import Logout from 'src/components/Home/Logout.vue'

import Affiliate from 'src/components/Account/Affiliate.vue'
import Billing from 'src/components/Account/Billing.vue'
import Profile from 'src/components/Account/Profile.vue'

import DailyDevLog from 'src/components/Act/DailyDevLog.vue'
import ManagerAccess from 'src/components/Act/ManagerAccess.vue'
import WhatIRead from 'src/components/Act/WhatIRead.vue'

import CurrentFocus from 'src/components/Grow/CurrentFocus.vue'
import ProfileEditor from 'src/components/Grow/ProfileEditor.vue'
import StrengthsOpportunities from 'src/components/Grow/StrengthsOpportunities.vue'
import WhatToRead from 'src/components/Grow/WhatToRead.vue'

import Income from 'src/components/Plan/Income.vue'
import Projects from 'src/components/Plan/Projects.vue'
import Time from 'src/components/Plan/Time.vue'

import Dashboard from 'src/components/Home/Dashboard.vue'

// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

let PlanMenu = {
  
  path: '/plan',
  meta: { 
    requiresAuth: true
  },
  component: DashboardLayout,
  children: [
    {
      path: 'time',
      name: 'Time',
      component: Time
    },
    {
      path: 'income',
      name: 'Income',
      component: Income
    },
    {
      path: 'projects',
      name: 'Projects',
      component: Projects
    }
  ]
}

let ActMenu = {
  
  path: '/act',
  meta: { 
    requiresAuth: true
  },
  component: DashboardLayout,
  children: [
    {
      path: 'dailydevlog',
      name: 'DailyDevLog',
      component: DailyDevLog
    },
    {
      path: 'whatiread',
      name: 'What I\'ve Read',
      component: WhatIRead
    },
    {
      path: 'manageraccess',
      name: 'Manager Access',
      component: ManagerAccess
    }
  ]
}
let GrowMenu = {
  
  path: '/grow',
  meta: { 
    requiresAuth: true
  },
  component: DashboardLayout,
  children: [
    {
      path: 'strengthsopportunities',
      name: 'Strengths & Opportunities',
      component: StrengthsOpportunities
    },
    {
      path: 'currentfocus',
      name: 'Current Focus',
      component: CurrentFocus
    },
    {
      path: 'whattoread',
      name: 'What to Read',
      component: WhatToRead
    },
    {
      path: 'profileeditor',
      name: 'Profile Editor',
      component: ProfileEditor
    }
  ]
}
let AccountMenu = {
  
  path: '/account',
  component: DashboardLayout,
  meta: { 
    requiresAuth: true
  },
  children: [
    {
      path: 'billing',
      name: 'Billing',
      component: Billing
    },
    {
      path: 'profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: 'affiliate',
      name: 'Affiliate',
      component: Affiliate
    },
    {
      path:'logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: 'passwordreset',
      name: 'Password Reset',
      component: PasswordReset
    }
  ]
}

let signinPage = {
  path: '/signin',
  name: 'Sign In',
  component: Authenticator
}

let signupPage = {
  path: '/signup',
  name: 'Sign Up',
  component: Authenticator
}

let HomeMenu = {
  
  path: '/home',
  component: DashboardLayout,
  meta: { 
    requiresAuth: true
  },
  children: [
    {
      path:'dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
}

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/home/dashboard'
  },
  AccountMenu,
  PlanMenu,
  ActMenu,
  GrowMenu,
  signinPage,
  signupPage,
  HomeMenu,
  {path: '*', component: NotFound}
];

export default routes
