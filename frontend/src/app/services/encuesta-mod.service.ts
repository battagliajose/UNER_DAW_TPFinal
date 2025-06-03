import { Injectable } from '@angular/core';
import { delay, Observable, map } from 'rxjs';
import { EncuestaDTO } from '../models/encuesta.dto';
import { EncuestaService } from './encuesta.service';


interface NuevaEncuestaDTO extends EncuestaDTO {
    esActivo: boolean;
    esEnviada: boolean;
}

@Injectable({
    providedIn: 'root',
  })
export class EncuestaModService {
    
constructor(private encuestaModService: EncuestaService) {}    

 encuestas: EncuestaDTO[] = [];
 encuestaMod: NuevaEncuestaDTO[] = [];

 loadEncuestas(): Observable<NuevaEncuestaDTO[]> {    
    return this.encuestaModService.getAll().pipe(
        delay(1000),
        map(data => {
            this.encuestas = data;
            this.encuestaMod = this.agregarAtributos(this.encuestas);
            return this.agregarValoresAleatorias(this.encuestaMod);
        })
    );
}
/**
 * Agrega atributos booleanas a un array de encuestas.
 * @param encuestas - Array de objetos NuevaEncuestaDTO a modificar
 * @returns Nuevo array con las propiedades adicionales con sus propiedades
 * @example codigoRespuesta:"xxxx-xxxx-xxxx-xxxx-xxx"
 * esActivo:1
 * esEnviada:0
 * id:1
 * nombre:"Encuesta de satisfacción"
 * preguntas:(2) [{…}, {…}]
 */
  private agregarAtributos(encuestas: EncuestaDTO[]) {
    return encuestas.map(encuesta => ({
      ...encuesta,
      //nuevos atributos
      esActivo:false,
      esEnviada:false
    }));
  }

 /**
 * Agrega valores aleatorios a los atributos esActivo y esEnviada
 * @param encuestas - Array de objetos NuevaEncuestaDTO a modificar. 
 * @returns Nuevo array con las propiedades adicionales con sus propiedades
 */
  private agregarValoresAleatorias(encuestas: NuevaEncuestaDTO[])  {
    return encuestas.map(encuesta => ({
      ...encuesta,
      esActivo: Math.random() > 0.5,  // Esto devuelve boolean
      esEnviada: Math.random() > 0.5
    }));
  }

}