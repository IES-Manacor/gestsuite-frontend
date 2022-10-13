import {axios}  from 'boot/axios'
import {Curs} from "src/model/gestib/Curs";
import {Departament} from "src/model/gestib/Departament";
import {
  UsuariWebIesManacor
} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";
import {UsuariService} from "src/service/UsuariService";
import {Calendari} from "src/model/google/Calendari";

export class CalendariService {

  /*static async getCalendariById(id:string): Promise<Departament> {
    const response = await axios.get(process.env.API + '/api/core/departament/getById/' + id);
    const data:any = await response.data;
    return this.fromJSON(data)
  }

  static async getCalendariByCodiGestib(id:string): Promise<Departament> {
    const response = await axios.get(process.env.API + '/api/core/departament/getByCodiGestib/' + id);
    const data = await response.data;
    return this.fromJSON(data)
  }*/

  static async getCalendaris(): Promise<Array<Calendari>> {
    const response = await axios.get(process.env.API + '/api/core/calendari/llistat');
    const data = await response.data;
    return data.map((calendari:any):Calendari=>{
        return this.fromJSON(calendari)
    });
  }

  static fromJSON(json:any):Calendari{
    return {
      id: json.idcalendari,
      email: json.gsuiteEmail,
      nom: json.gsuiteNom,
      descripcio: json.gsuiteDescripcio,
      tipus: json.calendariTipus,
      gestibGrup: json.gestibGrup,
      usuarisLectura: (json.usuarisLectura)?json.usuarisLectura.map((u:any)=>UsuariService.fromJSON(u)):undefined,
      usuarisEdicio: (json.usuarisEdicio)?json.usuarisEdicio.map((u:any)=>UsuariService.fromJSON(u)):undefined,
      label: json.gsuiteNom,
      value: json.idcalendari
    }
  }
}
