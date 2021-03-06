import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../service/auth.service';
import { TokenStorageService } from '../../service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  }
  isLoggedIn = false
  isLoginFailed = false
  errorMessage = ''
  roles: string[] = []

  constructor(
    private authService: AuthService,
    private token: TokenStorageService
  ) { }

  ngOnInit(): void {
    if(this.token.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.token.getUser().roels;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(data => {
      this.token.saveToken(data.accessToken);
      this.token.saveUser(data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.token.getUser().roles;
      this.reloadPage();
    }, error => {
      this.errorMessage = error.error.message;
      this.isLoginFailed = true
    })
  }

  reloadPage(): void {
    window.location.reload();
  }

}
