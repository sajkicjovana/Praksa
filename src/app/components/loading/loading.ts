import { Component, computed } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.services';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  constructor(private loadingService: LoadingService){}

  isLoading=computed(()=>this.loadingService.isLoading())


}
