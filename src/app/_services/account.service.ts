import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser

import { environment } from '../../environments/environment';
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public user: Observable<User | null> = this.userSubject.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
    ) {
        if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
            const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
            if (storedUser) {
                this.userSubject.next(storedUser);
            }
        }
    }

    public get userValue(): User | null {
        return this.userSubject.value;
    }

    login(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(
                map(user => {
                    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
                        localStorage.setItem('user', JSON.stringify(user));
                        this.userSubject.next(user);
                    }
                    return user;
                })
            );
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
            localStorage.removeItem('user');
            this.userSubject.next(null);
            this.router.navigate(['/account/login']);
        }
    }

     register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}
