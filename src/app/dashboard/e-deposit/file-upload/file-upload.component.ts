import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { userAccount } from 'src/app/models/getsession.model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private userService : UserService,private toaster:ToastrService) { }

  currentUserDetails:userAccount;
  ngOnInit(): void {
    this.userService.currentuserSubject.subscribe((data) => {this.currentUserDetails = data.data;});
    this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
  }
  
  fileList:any=[]
  getUploadedFileDetails(clientId)
  {
    this.userService.getUploadedFileDetails(clientId).subscribe(data=>{this.fileList=data.data})
  }

  fileUpload(event)
  { 
    var formDetails ={ 
                      'uploadedBy':this.currentUserDetails.userAccountId,
                      'fullName':this.currentUserDetails.firstName +''+ this.currentUserDetails.lastName
                     }
     
     const formData=new FormData();
     formData.append('uploadedBy',this.currentUserDetails.firstName + this.currentUserDetails.lastName)
     formData.append('userAccountId',this.currentUserDetails.userAccountId.toString())
     for (var i = 0; i < event.target.files.length; i++) { 
      formData.append("file", event.target.files[i]);
    }
     this.userService.fileUpload(formData).subscribe(data=>{
       if(data.status==true)
       {
         this.toaster.success(data.message)
       }
       else{
        this.toaster.info(data.message +" "+"these files already exist")
       }
      this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
     })
     event.target.value=''
  } 

  downloadFile(fileDetails,preview)
  { 
    if(preview)
     window.open(environment.api_url+"/api/file/"+fileDetails.uploadedBy+"/"+fileDetails.fileName+"/"+true)
     else
     window.open(environment.api_url+"/api/file/"+fileDetails.uploadedBy+"/"+fileDetails.fileName+"/"+false)
  }

  deleteFile(fileDetails)
  {
    this.userService.deleteFileDetails(fileDetails).subscribe(data=>{
      if(data.status==true)
      {
        this.toaster.success(data.message)
      }
      else{
       this.toaster.info(data.message)
      }
     this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
    })
  }
}
