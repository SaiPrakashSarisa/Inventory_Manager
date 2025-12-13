import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() isCollapsed: boolean = false;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      command: () => {}
    },
    {
      label: 'Inventory',
      icon: 'pi pi-box',
      route: '/inventory',
      command: () => {}
    },
    {
      label: 'Products',
      icon: 'pi pi-shopping-bag',
      route: '/products',
      command: () => {}
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      route: '/orders',
      command: () => {}
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/reports',
      command: () => {}
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings',
      command: () => {}
    }
  ];
}

