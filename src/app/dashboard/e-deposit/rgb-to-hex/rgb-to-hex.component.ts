import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rgb-to-hex',
  templateUrl: './rgb-to-hex.component.html',
  styleUrls: ['./rgb-to-hex.component.css']
})
export class RgbToHexComponent implements OnInit {


  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }
  hexValue: any = {}
  onSubmit(hexForm) {
     
    var rgbValue: any = null;
    rgbValue = [Number(hexForm.value.red), Number(hexForm.value.green), Number(hexForm.value.blue)]
    this.userService.rgbToHexColor(rgbValue).subscribe(data => { this.hexValue = data })

  }
}
