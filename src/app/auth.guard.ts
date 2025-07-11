import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('userName');
    if (user) {
      return true;
    } else {
      this.router.navigate(['/user-login']);
      return false;
    }
  }
}
