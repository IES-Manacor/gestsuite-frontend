import {axios}  from 'boot/axios'
import {Curs} from "src/model/gestib/Curs";
import {Grup} from "src/model/gestib/Grup";
import {UsuariService} from "src/service/UsuariService";

export class GrupService {

  static async getGrupsByCurs(curs:Curs,includeTutorsGrup:boolean=false): Promise<Array<Grup>> {
    const response = await axios.get(process.env.API + '/api/core/grup/findByCurs/'+curs.id);
    const grups = await response.data;

    return Promise.all(grups.map(async (grup:any)=>{
      return await this.fromJSON(grup,includeTutorsGrup);
    }));
  }

  static async getByGestibIdentificador(id:string): Promise<Grup> {
    const responseGrup = await axios.get(process.env.API + '/api/core/grup/getByGestibIdentificador/'+id);
    const grup:any = await responseGrup.data;
    return this.fromJSON(grup);
  }

  static async fromJSON(json:any,includeTutorsGrup:boolean=false):Promise<Grup>{
    let tutor1 = undefined;
    if(json.gestibTutor1 && includeTutorsGrup){
      tutor1 = await UsuariService.getByGestibId(json.gestibTutor1);
    }
    let tutor2 = undefined;
    if(json.gestibTutor2 && includeTutorsGrup){
      tutor2 = await UsuariService.getByGestibId(json.gestibTutor2);
    }
    let tutor3 = undefined;
    if(json.gestibTutor3 && includeTutorsGrup){
      tutor3 = await UsuariService.getByGestibId(json.gestibTutor3);
    }
    return {
      id: json.idgrup,
      nom: json.gestibNom,
      tutor1: tutor1,
      tutor2: tutor2,
      tutor3: tutor3
    }
  }
}
