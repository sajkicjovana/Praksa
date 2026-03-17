import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column, GridOption, AngularSlickgridComponent } from 'angular-slickgrid';


@Component({
  selector: 'app-connections',
  imports: [AngularSlickgridComponent,FormsModule],
  templateUrl: './connections.html',
  styleUrl: './connections.css',
})
export class Connections {
  columns: Column[] =[];
  gridOptions:GridOption = {};
  dataset:any[]=[];
  showForm=false;

  types=["HTTP","SMPP"];
  
  constructor(){
    this.prepareGrid();
  }
  prepareGrid(){
    this.columns=[
      {id:'name', name:"Name",field:'name',sortable:true},
      {id:'url', name:"Url",field:'url',sortable:true},
      {id:'password', name:"Password",field:'password'},
      {id:'username', name:"Username",field:'username'}, 
      {id:'sms', name:"SMS throughput",field:'sms'},
      {id:'type', name:"Type",field:'type'},
      {id:"action",name:"Action",field:'action'},
    ]
     this.gridOptions={
      enableAutoResize:true,
      enableSorting: true
    };
  }
  openForm(){
    this.showForm=true;
  }
  closeForm(){
    this.showForm=false;
  }
  onSubmit(form:any){
    if(form.valid){
      this.dataset=[...this.dataset,form.value];
      form.reset();
    }

  }


}
