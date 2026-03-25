import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateMessageDto, Message } from '../../mock-api/routing/routing.model';
import { MessagesService } from '../../services/messages.services';

@Component({
  selector: 'app-new-message',
  imports: [FormsModule],
  templateUrl: './new-message.html',
  styleUrl: './new-message.css',
})
export class NewMessageComponent {

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  @Input() editingItem: Message | null = null;
  private service = inject(MessagesService);

  numbers: string[] = [];

  formModel = {
    senderId: '',
    messageText: '',
    currentNumber: ''
  };

  constructor(private snackBar: MatSnackBar) {}

  addNumber(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.formModel.currentNumber) {
      event.preventDefault();
      this.numbers.push(this.formModel.currentNumber);
      this.formModel.currentNumber = '';
    }
  }

  removeNumber(i: number) {
    this.numbers.splice(i, 1);
  }

  onSubmit(form: any) {
    if (form.invalid || this.numbers.length === 0) return;

    this.numbers.forEach(num => {
      const dto: CreateMessageDto = {
        senderId: this.formModel.senderId,
        sendTo: num,
        messageText: this.formModel.messageText,
      };
      console.log(dto);
      this.service.create(dto).subscribe({
        next: () => {
          
          this.snackBar.open('Message sent', 'OK', { duration: 2000 });
          this.saved.emit();
        },
        error: () => {
          this.snackBar.open('Error sending message', 'OK', { duration: 2000 });
        }
      });
    });

    this.reset();
  }
  
  ngOnChanges() {
  if (this.editingItem) {
    this.formModel.senderId = this.editingItem.senderId;
    this.formModel.messageText = this.editingItem.messageText;
    this.numbers = [this.editingItem.sendTo];
  }
}

  reset() {
    this.formModel = {
      senderId: '',
      messageText: '',
      currentNumber: ''
    };
    this.numbers = [];
  }

  closeForm() {
    this.reset();
    this.close.emit();
  }
}