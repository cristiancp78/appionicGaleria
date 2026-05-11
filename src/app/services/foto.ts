import { Injectable } from '@angular/core';
import {Camera, CameraPhoto, CameraResultType, CameraSource, Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Preferences} from '@capacitor/preferences'
import {Foto} from '../Models/foto.interface'

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  //Arreglo donde se guardan las fotos
  public fotos: Foto[] =[];
  //Llave para el storage
  private PHOTO_STORAGE: string = 'fotos';

  //Constructor de la clase
  constructor(){}

  //Metodo que permite tomar una foto con la camara
  public async addNewToGallery(){
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
    
    //Guardar la foto
    const savedImageFile = await this.savePicture(fotoCapturada)

    //Agregar la foto al arreglo
    this.fotos.unshift(savedImageFile as Foto)

    //Guardar las fotos en el storage
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.fotos)
    })
  }

  //Metodo que toma la foto y la convierte a base64
  public async savePicture(cameraPhoto:CameraPhoto){
    //Convertir la foto a base64
    const base64Data = await this.readAsBase64(cameraPhoto);
    
    //Guardar la foto en el filesystem
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    //Retorna la foto guardada
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }

  //Lee la foto y la convierte a string en base64
  private async readAsBase64(cameraPhoto:CameraPhoto){
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  //convierte un blob a base64
  private convertBlobToBase64 = (blob:Blob) => new Promise((resolve, reject) =>{
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  //Recupera las fotos guardadas en el filesystem
  public async loadSaved(){
    //Obtiene las fotos guardadas en el filesystem y las convierte a JSON
    const listaFotos = await Preferences.get({key: this.PHOTO_STORAGE})
    this.fotos = listaFotos.value? JSON.parse(listaFotos.value) : []

    //Recorre el arreglo de fotos y recupera la foto guardada en el filesystem
    for(let foto of this.fotos){
      //Lee la foto guardada en el filesystem
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: foto.filepath
      })

      //Convierte la foto a base64 para solo la web
      foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
}
