import {Component, Input, NgModule, OnChanges, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, Output} from '@angular/core';
import {GlobusService} from '../globus.service';
import {catchError, filter, flatMap} from 'rxjs/operators';
import {v4 as uuid } from 'uuid';
import {forkJoin, from, merge, of, pipe, throwError} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TransferData} from '../upload/upload.component';


interface SelFilesType {
  fileNameObject: any;
  directory: string;
}


@Component({
  selector: 'app-personal-connect',
  templateUrl: './personal-connect.component.html',
  styleUrls: ['./personal-connect.component.css']
})
export class PersonalConnectComponent implements OnChanges, OnInit {

  constructor(private globusService: GlobusService,
              public snackBar: MatSnackBar) { }

  @Input() dataTransfer: TransferData;
  load: boolean;
  selectedEndPoint: any;
  personalConnectEndpoints: Array<object>;

  ngOnInit(): void {
    this.load = false;
  }

  ngOnChanges() {
    this.load = false;
    if (typeof this.dataTransfer.userAccessTokenData !== 'undefined') {
      this.getPersonalConnect(this.dataTransfer.userAccessTokenData)
          .subscribe(
              data => this.processPersonalConnect(data),
              error => {
                console.log(error),
                    this.load = true;
              },
              () => {
                this.load = true;
              }
          );
    }
  }

  getPersonalConnect(userAccessTokenData) {
    const url = 'https://transfer.api.globusonline.org/v0.10/endpoint_search?filter_scope=my-gcp-endpoints';

    const userOtherAccessToken = this.dataTransfer.userAccessTokenData.other_tokens[0].access_token;
    // this.userAccessToken = userAccessTokenData.access_token;
    return this.globusService
        .getGlobus(url, 'Bearer ' + userOtherAccessToken);
  }

  processPersonalConnect(data) {
    this.personalConnectEndpoints = new Array<object>();
    for (const obj of data.DATA) {
      if (obj.gcp_connected) {
        this.personalConnectEndpoints.push(obj);
        console.log(obj);
      }
    }
    if (this.personalConnectEndpoints.length === 0) {
      console.log('Globus Personal Connect is not connected');
    } else {
      this.selectedEndPoint = this.personalConnectEndpoints[0];
    }

  }

  personalConnectExist() {
    if (typeof this.personalConnectEndpoints !== 'undefined' && this.personalConnectEndpoints.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  setSelectedEndpoint(event) {
    this.selectedEndPoint = event.value;
  }


}
