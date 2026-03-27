import { Message } from '../../mock-api/routing/routing.model';
import { NewMessageComponent } from '../new-message/new-message';
import { MessagesService } from '../../services/messages.services';
import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column, GridOption, AngularSlickgridComponent, Formatter } from 'angular-slickgrid';
import { Router, RouterLink } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Loading } from "../loading/loading";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-messages',
  imports: [FormsModule, RouterLink, AngularSlickgridComponent, NewMessageComponent,MatSlideToggleModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  isLoading=true;
  router: Router = inject(Router);

  private service = inject(MessagesService);
  private zone = inject(NgZone);
  private cdr= inject(ChangeDetectorRef);
  isReal =false;
  messages: Message[] = [];
  showForm = false;
  editingItem: Message | null = null;
  columns: Column[] = [];
  gridOptions: GridOption = {};

  isLogged() {
    return localStorage.getItem("token") != null;
  }
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
  isAdmin(){
    if(localStorage.getItem('role')==='admin'){
      return true;
    }
    return false;
    
  }
  
  ngOnInit() {
    this.loadAll();
  }

  constructor(private snackBar: MatSnackBar) {
    this.prepareGrid();
  }

  startEdit(item: Message) {
    this.editingItem = item;
    this.showForm = true;
  }
  loadAll(note?:string) {
    this.isLoading=true;
    this.service.getAll(this.isReal).subscribe(data => {
      this.messages = data.map(item => ({
        ...item,
        from: item.senderId,
        to: item.sendTo,
        text: item.messageText
       
      }));
  
      if(note){
        this.snackBar.open(note, 'OK', { duration: 2000 });
      }
      this.isLoading=false;
      this.cdr.detectChanges();
    });
}

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  onSaved() {
    this.loadAll();
    this.closeForm();
  }

  prepareGrid() {
      const actionsFormatter: Formatter = (_row, _cell, _value, _col, dataContext) => {
        let buttons = '';

        if (!dataContext['sent']) {
          buttons += `
            <button class="grid-btn-retry" data-id="${dataContext['id']}" title="Retry">🔁</button>
          `;
        }
        buttons+= `<button class="grid-btn-edit" data-id="${dataContext['id']}" title="Edit">✏️</button>`;
        if(localStorage.getItem("role")==="admin"){
            buttons +=`<button class="grid-btn-delete" data-id="${dataContext['id']}" title="Delete">🗑️</button>`;
          }
        return buttons;
        };
    this.columns = [
      {id: 'senderId', name: 'From', field: 'senderId' },
      {id: 'sendTo', name: 'To', field: 'sendTo' },
      {id: 'sent', name: 'Status', field: 'sent',formatter: (_r,_c,v) => v ? 'Sent' : 'Failed'},
      { id: 'actions',  name: 'Actions',  field: 'actions',  minWidth: 90, maxWidth: 120, cssClass: "text-end",
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
    target.dataset?.['id'] ||
    target.closest('[data-id]')?.getAttribute('data-id')
  );

  if (!id) return;

  const item = this.messages.find(x => x.id === id);
  if (!item) return;

  if (target.closest('.grid-btn-retry')) {
    this.zone.run(() => this.retryMessage(item));
  }
  else if (target.closest('.grid-btn-edit')) {
    this.zone.run(() => this.startEdit(item));
  }
  else if (target.closest('.grid-btn-delete')) {
    this.zone.run(() => this.confirmDelete(item));
  }

}

confirmDelete(item: Message) {
  if (!confirm('Are you sure?')) return;

  this.service.delete(item.id).subscribe({
    next: () => {
     this.loadAll("Deleted");
    },
    error: () => {
      this.snackBar.open('Delete failed', 'OK', { duration: 2000 });
    }
  });
}

retryMessage(item: Message) {
  const dto = {
    senderId: item.senderId,
    sendTo: item.sendTo,
    messageText: item.messageText,
    sent: true
  };
  this.service.create(dto,false).subscribe({
    next: () => {
      this.loadAll("Message resent");
    },
    error: () => {
      this.snackBar.open('Retry failed', 'OK', { duration: 2000 });
    }
  });
}

}