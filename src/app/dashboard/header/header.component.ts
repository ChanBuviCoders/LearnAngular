import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userAccount } from 'src/app/models/getsession.model';
import {
  FINANCE_REPORT_ROLES,
  FINANCE_SETTINGS_ROLES,
  FINANCE_STAFF_ROLES,
  RoleAccessService
} from 'src/app/shared/services/role-access.service';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  adminOnly?: boolean;
}

interface NavGroup {
  label?: string;
  icon?: string;
  items: NavItem[];
}

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private userService: UserService,
    readonly access: RoleAccessService) { }

  currentUserDetails: userAccount;
  readonly navGroups: NavGroup[] = [
    {
      items: [
        { label: 'Dashboard', icon: 'fa-bar-chart', route: '/dashboard/financial-dashboard', roles: FINANCE_STAFF_ROLES },
        { label: 'Customers', icon: 'fa-users', route: '/dashboard/finance/customers', roles: FINANCE_STAFF_ROLES },
        { label: 'Loans', icon: 'fa-inr', route: '/dashboard/finance/loans', roles: FINANCE_STAFF_ROLES },
        { label: 'Loan Products', icon: 'fa-cogs', route: '/dashboard/finance/loan-products', roles: FINANCE_SETTINGS_ROLES }
      ]
    },
    {
      label: 'Collections',
      icon: 'fa-calendar',
      items: [
        { label: 'Daily', icon: 'fa-calendar', route: '/dashboard/finance/collections/daily', roles: FINANCE_STAFF_ROLES },
        { label: 'Weekly', icon: 'fa-calendar', route: '/dashboard/finance/collections/weekly', roles: FINANCE_STAFF_ROLES },
        { label: 'Monthly', icon: 'fa-calendar', route: '/dashboard/finance/collections/monthly', roles: FINANCE_STAFF_ROLES }
      ]
    },
    {
      items: [
        { label: 'Chits', icon: 'fa-group', route: '/dashboard/chits', roles: FINANCE_STAFF_ROLES },
        { label: 'Reports', icon: 'fa-file-text', route: '/dashboard/reports', roles: FINANCE_REPORT_ROLES },
        { label: 'Customer Profile', icon: 'fa-address-card', route: '/dashboard/customer-profile', roles: FINANCE_STAFF_ROLES }
      ]
    },
    {
      label: 'Admin',
      icon: 'fa-lock',
      items: [
        { label: 'Settings', icon: 'fa-cog', route: '/dashboard/settings', roles: FINANCE_SETTINGS_ROLES },
        { label: 'Audit', icon: 'fa-history', route: '/dashboard/audit', roles: FINANCE_SETTINGS_ROLES },
        { label: 'Users & Roles', icon: 'fa-lock', route: '/dashboard/user-roles', adminOnly: true }
      ]
    }
  ];

  ngOnInit(): void {
    this.subjectService.currentuserSubject.subscribe(data => {
      this.currentUserDetails = data.data;
    });
  }

  visibleItems(group: NavGroup): NavItem[] {
    return group.items.filter(item => this.access.canSee(item));
  }

  logout() {
    const payload = { "userAccountId": this.currentUserDetails.userAccountId };
    this.userService.logout(payload).subscribe(data => {
      if (data.status) {
        this.router.navigate(['/login']);
      }
    });
    this.userService.clearLocalStorage();
  }
}
