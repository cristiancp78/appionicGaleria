import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import {  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, imageOutline,cameraOutline,camera } from 'ionicons/icons';
import {FotoService} from '../services/foto'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, CommonModule, IonImg],
})
export class Tab1Page {
  //Constructor de la clase
  constructor(public fotoService: FotoService) {
    addIcons({ library, imageOutline, camera });
  }

  //Metodo que agrega una foto a la galeria
  addPhotoToGallery() {
    this.fotoService.addNewToGallery()
  }

  //Metodo que carga las fotos guardadas al iniciar la pagina
  async ngOnInit(){
    await this.fotoService.loadSaved()
  }
}
