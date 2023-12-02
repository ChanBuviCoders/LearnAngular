import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-billpayment',
  templateUrl: './billpayment.component.html',
  styleUrls: ['./billpayment.component.css']
})
export class BillpaymentComponent implements OnInit {

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }
  hexValue:any={}
  onSubmit(value)
  {
      var rgbValue=[Number(value.red),Number(value.green),Number(value.blue)]
      this.userService.rgbToHexColor(rgbValue).subscribe(data=>{this.hexValue=data})

  }

}
