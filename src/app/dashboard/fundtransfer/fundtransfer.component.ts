import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fundtransfer',
  templateUrl: './fundtransfer.component.html',
  styleUrls: ['./fundtransfer.component.css']
})
export class FundtransferComponent implements OnInit {

  modalRef: BsModalRef;
  testForm: FormGroup;
  addCustomerForm:FormGroup;
  constructor(private fb: FormBuilder, private modalService: BsModalService,private datePipe:DatePipe,private userService:UserService,private toastr:ToastrService) {
    this.testForm = this.fb.group({
      date: ["", Validators.required],
      time: this.fb.group({
        HH: ["", Validators.required],
        min: ["", Validators.required],
        sec: ["", Validators.required],
      }),
    });

    this.addCustomerForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      loanAmount:['',Validators.required],
      mobileNumber:['',Validators.required],
      loanType:[null,Validators.required]
    })
  }
  currentUserDetails:any={}
  ngOnInit(): void { 
        this.userService.currentuserSubject.subscribe((data) => {this.currentUserDetails = data;});
        this.getallCustomerList()
     }

  customerList:any =[]
  getCutomerList() {

  }

  contentReady(event)
  {

  }
  type:string="Add"
  openPopUp(modalName)
  {  this.type="Add"
    this.addCustomerForm.reset()
    this.modalRef=this.modalService.show(modalName)
    // this.sendMail()
  }
  addCustomerFunction(formValue)
  {   let startDate=new Date()     
       formValue.startDate=this.datePipe.transform(new Date(),'yyyy-MM-dd')
       formValue.clientId=this.currentUserDetails.clientId
       formValue.endDate=this.datePipe.transform(new Date(new Date().setDate(startDate.getDate()+100)),'yyyy-MM-dd')
      
       if(this.type=="Add")
       {
        this.userService.addCustomer(formValue).subscribe(res=>{
          if(res.status==true)
          {
            this.toastr.success(res.message)
            this.modalRef.hide()
            this.getallCustomerList()
          }
          else
          {
            this.toastr.error(res.message)
          }
         })
       }
       else{
         formValue.customerId=this.editCustomerDetails.customerId
        this.userService.updateCustomer(formValue).subscribe(res=>{
          if(res.status==true)
          {
            this.toastr.success(res.message)
            this.modalRef.hide()
            this.getallCustomerList()
          }
          else
          {
            this.toastr.error(res.message)
          }
         })
       }
  }
  editCustomerDetails:any={}
  editFunction(values,popUpName)
  {  
    this.addCustomerForm.reset()
    this.type="Update"
    this.editCustomerDetails=values
    this.addCustomerForm.patchValue({
      firstName:values.firstName,
      lastName:values.lastName,
      loanAmount:values.loanAmount,
      mobileNumber:values.mobileNumber,
      loanType:values.loanType
    });
    this.modalRef=this.modalService.show(popUpName)
  }

  getallCustomerList()
  { let payLoad={clientId:this.currentUserDetails.clientId}
    this.userService.getAllCustomerList(payLoad).subscribe(data=>{
      this.customerList=data
      var count =0;
      this.customerList.forEach(data=>{
        data.SerialNumber=++count;
      })
    })
  }

  deleteCustomer(values)
  {  
    let payLoad = {customerId:values.customerId}
    this.userService.deleteCustomer(payLoad).subscribe(res=>{
      if(res.status==true)
      {
        this.toastr.success(res.message)
        this.getallCustomerList();
      }
      else
      {
        this.toastr.error(res.message)
      }
    })
  }

  sendSms(data)
  {
    this.userService.sendSmsToMobileNumber().subscribe(data=>{console.log('--------status--------',data);})
  }
  
  sendMail()
  {
    this.userService.sendMail().subscribe(data=>{console.log('--------status--------',data);})
  }

}
