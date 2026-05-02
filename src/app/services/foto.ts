import { Injectable } from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Storage} from '@capacitor/storage'
import {Foto} from '../Models/foto.interface'

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  public fotos: Foto[] =[];

  constructor(){}

  public async addNewToGallery(){
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    this.fotos.unshift({
      filepath: "foto_",
      webviewPath: fotoCapturada.webPath || ''
    })
  }
}
