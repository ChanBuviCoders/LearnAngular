import { Component, OnInit, ViewChild } from '@angular/core';
import { userAccount } from 'src/app/models/getsession.model';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-e-statement-subscription',
  templateUrl: './e-statement-subscription.component.html',
  styleUrls: ['./e-statement-subscription.component.css']
})
export class EStatementSubscriptionComponent implements OnInit {

  constructor(private userService: UserService) { }

  currentUserDetails: userAccount;
  dataType: number = 1
  ngOnInit(): void {

    this.userService.currentuserSubject.subscribe((data) => { this.currentUserDetails = data.data; });
    this.getChartDetails(this.currentUserDetails.userAccountId,this.dataType)
  }

  /* **************** charts data********************** */
  chartData = [
    {
      data: [330, 600, 260, 700],
      label: 'Account A'
    },
    {
      data: [120, 455, 100, 340],
      label: 'Account B'
    },
    {
      data: [45, 67, 800, 500],
      label: 'Account C'
    }
  ];
  /* **************** charts label********************** */
  chartLabels = ['January', 'February', 'March', 'April'];
  chartOptions = { responsive: true };
  /* **************** charts events********************** */
  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };

  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };

  /* **************** Updating Datasets Dynamically********************** */
  newDataPoint(dataArr = [100, 100, 100], label) {
    this.chartData.forEach((dataset, index) => {
      this.chartData[index] = Object.assign({}, this.chartData[index], {
        data: [...this.chartData[index].data, dataArr[index]]
      });
    });

    this.chartLabels = [...this.chartLabels, label];
  }
  getChartDetails(clientId, dataType) {
    this.dataType = dataType == 1 ? 2 : 1
    this.userService.getChartDetails(clientId, dataType).subscribe(data => {
      this.chartData = data.data.chartData
      this.chartLabels = data.data.chartLabels
    })
  }
}
