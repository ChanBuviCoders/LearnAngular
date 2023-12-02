import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mini-statement',
  templateUrl: './mini-statement.component.html',
  styleUrls: ['./mini-statement.component.css']
})
export class MiniStatementComponent implements OnInit {

  
  constructor(private userService:UserService) { }

  currentUserDetails:any={}
  ngOnInit(): void {

    this.userService.currentuserSubject.subscribe((data) => {this.currentUserDetails = data;});
    this.getChartDetails(this.currentUserDetails.clientId)
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
  chartLabels = ['January','February','March','April'];
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

getChartDetails(clientId)
{ 
  this.userService.getChartDetails(clientId,1).subscribe(data=>{
    this.chartData=data.chartData
    this.chartLabels=data.chartLabels
  })
}

}
