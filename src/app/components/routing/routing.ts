import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column, GridOption, AngularSlickgridComponent, Formatter } from 'angular-slickgrid';
import { ConnectionsService } from '../../services/connections.service';
import { RoutingService } from '../../services/routing.service';
import { forkJoin } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
@Component({
  selector: 'app-routing',
  imports: [RouterLink,FormsModule,AngularSlickgridComponent],
  templateUrl: './routing.html',
  styleUrl: './routing.css',
})
export class Routing implements OnInit{
  private service = inject(RoutingService);
  private zone=inject(NgZone);
  private cdr=inject(ChangeDetectorRef);
  private connectService = inject(ConnectionsService);
  
  router: Router = inject(Router);
  
  searchCountry: string = '';
  searchOperator: string = '';
  searchConnection: string = '';

  connections: any[] = [];
  countries: any[] = [];
  operators: any[] = [];
  routing: any[] = [];
  currencies = ['USD','RSD','EUR']
  filteredOperators: any[] = []


  columns: Column[] = []
  gridOptions: GridOption = {};
  dataset: any[] = [];
  showForm = false;
  showDeleteModal = false;
  itemToDelete: any = null;
  editingItem: any = null;
  
  isLoading = false;


  formModel = {
    country:'' , operator: '', connection: '', price: null as any, currency: '', 
  };

  //zemlja dropdown, operator dropdown, connections dropdown, price broj, currency dropdown

  constructor(private snackBar: MatSnackBar) {
    this.prepareGrid();
  }

  ngOnInit(){
    this.loadAll();
  }
  loadAll(itemDeleted? : boolean){
    // console.log("LOAD ALLL");
    this.isLoading=true;
    forkJoin({
      countries:this.service.getCountries(),
      operators:this.service.getAllOperators(),
      connections:this.connectService.getAll(),
      routing:this.service.getAllRouting()
    }).subscribe(({countries,operators,connections,routing}) => {
      this.countries=countries;
      this.connections=connections;
      this.operators=operators;
      this.dataset= routing.map(item =>({
       ...item,
      //  country:item.countryId,
       country:this.getCountryName(item.countryId),
       operator:this.getOperatorName(item.operatorId),
       connection:this.getConnectionName(item.connectionId)
      }));
      this.isLoading=false;
      this.cdr.detectChanges();

      if(itemDeleted){
        this.snackBar.open("Connection is deleted ", 'Ok', {
                duration: 3000
              });
      }
    });
  }
    isLogged() {
      return localStorage.getItem("token") != null;
    }
  Logout() {
      localStorage.removeItem("token");
      this.router.navigate(["login"]);
    }

  getCountryName(id: number): string{
    return this.countries.find(c =>c.id===id)?.name || '';
  }
  
  getOperatorName(id: number): string{
    return this.operators.find(o =>o.id===id)?.name || '';
  }
  getConnectionName(id: number): string{
    return this.connections.find(c =>c.id===id)?.name || '';
  }

  prepareGrid() {
    const actionsFormatter: Formatter = (_row, _cell, _value, _col, dataContext) => {
      return `
        <button class="grid-btn-edit" data-id="${dataContext['id']}" title="Edit">✏️</button>
        <button class="grid-btn-delete" data-id="${dataContext['id']}" title="Delete">🗑️</button>
      `;
    };
    this.columns = [
      { id: 'country',      name: 'Country',      field: 'country',   sortable: true, minWidth: 100 },
      { id: 'operator',     name: 'Operator',     field: 'operator',  sortable: true, minWidth: 150 },
      { id: 'connection',   name: 'Connection',  field: 'connection',  minWidth: 110 },
      { id: 'price',        name: 'Price',        field: 'price',        minWidth: 100,  },
      { id: 'currency',     name: 'Currency',     field: 'currency',     minWidth: 70 },
      { id: 'actions',      name: 'Actions',      field: 'actions',      minWidth: 90,maxWidth: 90,
        formatter: actionsFormatter, sortable: false },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: { container: '.container', bottomPadding: 20 },
      forceFitColumns: true,
      gridHeight: 350,
      rowHeight: 46,
      enableSorting: true,
      enableCellNavigation: false,
    };
  }

  onGridClick(event: any) {
    const target = event?.detail?.eventData?.target as HTMLElement;
    if (!target) return;
    const id = Number(
      target.dataset?.['id'] || target.closest('[data-id]')?.getAttribute('data-id')
    );
    if (!id) return;
    const item = this.dataset.find(x => x.id === id);
    if (!item) return;

    if (target.closest('.grid-btn-edit')) {
      this.zone.run(() => this.startEdit(item));
    } else if (target.closest('.grid-btn-delete')) {
      this.zone.run(() => this.confirmDelete(item));
    }
  }

  openForm() {
    this.editingItem = null;
    this.formModel = { country: '', operator: '', connection: '', price: null, currency: '' };
    this.showForm = true;
  }
  onCountryChange(){
    const countryId=Number(this.formModel.country);
    // console.log(countryId)

    this.filteredOperators=this.operators.filter(o => o.countryId===countryId)
    // console.log(this.filteredOperators)

    // this.formModel.operator='';
  }

  startEdit(item: any) {
    this.editingItem = item;
    // console.log(item);
    this.formModel = {...item,
      country:item.countryId,
      operator:item.operatorId,
      connection:item.connectionId
     };
    // console.log(this.formModel);
    this.showForm = true;
    this.onCountryChange()
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
  }

  confirmDelete(item: any) {
    this.itemToDelete = item;
    console.log(item);
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    this.service.deleteRouting(this.itemToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.itemToDelete = null;
        this.loadAll(true);
      
      },
      error: err => console.error('Delete error:', err.error)
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }
  onSubmit(form: any) {
    if (!form.valid) return;

    console.log("on SUbmit",this.formModel)

    const dto = {
      countryId: Number(this.formModel.country),
      operatorId: Number(this.formModel.operator),
      connectionId: Number(this.formModel.connection),
      price: parseFloat(this.formModel.price),
      currency: this.formModel.currency,
    };
    console.log("DTo submit",dto)
    if (this.editingItem) {
      this.service.updateRouting(this.editingItem.id, dto).subscribe({
        next: () => { 
          this.loadAll(); 
          this.closeForm(); 
          form.reset();
          this.snackBar.open("Route successfully edited", 'Ok', {
          duration: 3000
        });
         },
        error: err => console.error('Update error:', err.error)
      });
    } else {

      this.service.createRouting(dto).subscribe({
        
        next: () => { 
          this.loadAll(); 
          this.closeForm(); 
          form.reset();
          this.snackBar.open("New route is successfully added ", 'Ok', {
          duration: 3000
        });
         },
        error: err => console.error('Create error:', err.error)
      });
    }
    // this.loadAll();
  }

  get filteredData(){

    // console.log("Serach:",this.searchName);
    // console.log("Type:",this.selectedType);

    // console.log(this.dataset)

    let data = [...this.dataset];
    if(this.searchCountry){
      const term = this.searchCountry.toLowerCase();
      data = data.filter(item =>
        (item.country || '').toLowerCase().includes(term)
      );
    }
    if(this.searchOperator){
      const term=this.searchOperator.toLowerCase();
      data=data.filter(item =>
        (item.operator || '').toLowerCase().includes(term)
      );
    }
    if(this.searchConnection){
      const term=this.searchConnection.toLowerCase();
      data=data.filter(item =>
        (item.connection || '').toLowerCase().includes(term)
      );
    }

  
    return data;
    // console.log(this.dataset)
    // console.log(this.filteredDataset)
  }
  resetFilters(){
    this.searchCountry = '';
    this.searchOperator = '';
    this.searchConnection = ''
  }


}
