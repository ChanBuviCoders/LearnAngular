import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { userAccount } from 'src/app/models/getsession.model';
import { SubjectService } from 'src/app/shared/services/subjectService';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private userService: UserService, private bsModelService: BsModalService, private subjectService: SubjectService, private toaster: ToastrService) { }

  currentUserDetails: userAccount;
  ngOnInit(): void {
    this.subjectService.currentuserSubject.subscribe((data) => { this.currentUserDetails = data.data; });
    this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
  }

  fileList: any = []
  getUploadedFileDetails(clientId) {
    this.userService.getUploadedFileDetails(clientId).subscribe(data => { this.fileList = data.data })
  }

  fileUpload(event) {
    var formDetails = {
      'uploadedBy': this.currentUserDetails.userAccountId,
      'fullName': this.currentUserDetails.firstName + '' + this.currentUserDetails.lastName
    }

    const formData = new FormData();
    formData.append('uploadedBy', this.currentUserDetails.firstName + this.currentUserDetails.lastName)
    formData.append('userAccountId', this.currentUserDetails.userAccountId.toString())
    for (var i = 0; i < event.target.files.length; i++) {
      formData.append("file", event.target.files[i]);
    }
    this.userService.fileUpload(formData).subscribe(data => {
      if (data.status == true) {
        this.toaster.success(data.message)
      }
      else {
        this.toaster.info(data.message + " " + "these files already exist")
      }
      this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
    })
    event.target.value = ''
  }
  fileDetails: any;
  modalRef: BsModalRef;
  @ViewChild('viewDocument') documentTem: TemplateRef<any>;
  downloadFile(fileDetails, preview) {

    this.fileDetails = fileDetails;
    if (preview) {
      // this.DocumentUrl=environment.api_url + "/api/file/" + fileDetails.uploadedBy + "/" + fileDetails.fileName + "/" + true
      this.modalRef = this.bsModelService.show(this.documentTem)
      // window.open(environment.api_url + "/api/file/" + fileDetails.uploadedBy + "/" + fileDetails.fileName + "/" + true)
    }
    else {
      const link = document.createElement('a');

      link.href = this.fileDetails.filePath;
      link.target = '_blank';
      link.download = fileDetails.fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // window.open(environment.api_url + "/api/file/" + fileDetails.uploadedBy + "/" + fileDetails.fileName + "/" + false)
  }

  deleteFile(fileDetails) {
    this.userService.deleteFileDetails(fileDetails).subscribe(data => {
      if (data.status == true) {
        this.toaster.success(data.message)
      }
      else {
        this.toaster.info(data.message)
      }
      this.getUploadedFileDetails(this.currentUserDetails.userAccountId)
    })
  }
}
