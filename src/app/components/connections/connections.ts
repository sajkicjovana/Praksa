import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column, GridOption, AngularSlickgridComponent, Formatter } from 'angular-slickgrid';
import { ConnectionsService } from '../../connections.service';

@Component({
  selector: 'app-connections',
  imports: [AngularSlickgridComponent, FormsModule],
  templateUrl: './connections.html',
  styleUrl: './connections.css',
})
export class Connections implements OnInit {
  private service = inject(ConnectionsService);
  private zone = inject(NgZone);
  private cdr= inject(ChangeDetectorRef);
  
  searchName: string='';
  selectedType:string='';
  // filteredDataset:any[]=[];

  columns: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  showForm = false;
  showDeleteModal = false;
  itemToDelete: any = null;
  editingItem: any = null;
  types = ['HTTP', 'SMPP'];
  isLoading=true;

  formModel = {
    name: '', url: '', username: '', password: '', sms: null as any, type: ''
  };

  constructor() {
    this.prepareGrid();
    // this.filteredDataset=this.dataset;
  }

  ngOnInit() {
    this.loadAll();
    // this.applyFilters();
  }


  loadAll() {
    this.isLoading=true;
    this.service.getAll().subscribe(data => {
      this.dataset = data.map(item => ({
        ...item,
        username: item.userName,
        sms: item.smsThroughput,
        type: item.type.toUpperCase(),
       
      }));
      // this.filteredDataset=this.dataset;
      this.isLoading=false;
      this.cdr.detectChanges();
    });
  }

  prepareGrid() {
    const actionsFormatter: Formatter = (_row, _cell, _value, _col, dataContext) => {
      return `
        <button class="grid-btn-edit" data-id="${dataContext['id']}" title="Edit">✏️</button>
        <button class="grid-btn-delete" data-id="${dataContext['id']}" title="Delete">🗑️</button>
      `;
    };
// brzina oznaka u tabeli
    this.columns = [
      { id: 'name',     name: 'Name',     field: 'name',     sortable: true, minWidth: 100 },
      { id: 'url',      name: 'URL',      field: 'url',      sortable: true, minWidth: 150 },
      { id: 'username', name: 'Username', field: 'username', minWidth: 110 },
      { id: 'password', name: 'Password', field: 'password', minWidth: 100, formatter: () => '••••••••' },
      { id: 'sms',      name: 'SMS',      field: 'sms',      minWidth: 70 },
      { id: 'type',     name: 'Type',     field: 'type',     minWidth: 70 },
      { id: 'actions',  name: 'Actions',  field: 'actions',  minWidth: 90, maxWidth: 90,
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
    this.formModel = { name: '', url: '', username: '', password: '', sms: null, type: '' };
    this.showForm = true;
  }

  startEdit(item: any) {
    this.editingItem = item;
    this.formModel = { ...item };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
  }

  onSubmit(form: any) {
    if (!form.valid) return;

    const dto = {
      name: this.formModel.name,
      url: this.formModel.url,
      userName: this.formModel.username,
      password: this.formModel.password,
      smsThroughput: this.formModel.sms,
      type: this.formModel.type.toLowerCase() as 'http' | 'smpp'
    };

    if (this.editingItem) {
      this.service.update(this.editingItem.id, dto).subscribe({
        next: () => { this.loadAll(); this.closeForm(); form.reset(); },
        error: err => console.error('Update error:', err.error)
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => { this.loadAll(); this.closeForm(); form.reset(); },
        error: err => console.error('Create error:', err.error)
      });
    }
  }

  confirmDelete(item: any) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    this.service.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.itemToDelete = null;
        this.loadAll();
      },
      error: err => console.error('Delete error:', err.error)
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  isUsernameTaken(username: string): boolean {
    if (!username) return false;
    return this.dataset.some(item =>
      item.username === username && item.id !== this.editingItem?.id
    );
  }

  get filteredData(){

    // console.log("Serach:",this.searchName);
    // console.log("Type:",this.selectedType);

    // console.log(this.dataset)

    let data=[...this.dataset];
    if(this.searchName){
      const term=this.searchName.toLowerCase();
      data=data.filter(item=>
        (item.name || '').toLowerCase().includes(term)
      );
    }

    if(this.selectedType){
      data=data.filter(item=>
        (item.type || '')===this.selectedType
      );
    }
    return data;
    // console.log(this.dataset)
    // console.log(this.filteredDataset)
  }
  resetFilters(){
    this.searchName='';
    this.selectedType='';
  }
  onTypeChange(){
    if(this.formModel.type=='SMPP'){
      this.formModel.url='';
    }
  }

}