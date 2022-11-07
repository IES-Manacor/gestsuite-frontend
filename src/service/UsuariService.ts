import {axios} from "boot/axios";
import {Usuari} from "src/model/Usuari";
import {GrupService} from "src/service/GrupService";

export class UsuariService {
  static async findUsuarisActius(includeGrup:boolean=false): Promise<Array<Usuari>> {
    const responseUsers = await axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
    const data = await responseUsers.data;
    const usuaris = await Promise.all(data.map(async (usuari:any):Promise<Usuari>=>{
      return await this.fromJSON(usuari,includeGrup)
    }))
    //return usuaris;
    return await usuaris.sort((a:Usuari,b:Usuari)=>{
      if( (!a || !a.label) && (!b || !b.label) ){
        return 0;
      }
      if(!a || !a.label){
        return -1;
      }
      if(!b || !b.label){
        return 1;
      }
      return a.label.localeCompare(b.label)
    });
  }

  static async getById(id:number): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile/'+id);
    const usuari:any = await responseUser.data;
    if(usuari.gestibGrup){
      usuari.grup=await GrupService.getByGestibIdentificador(usuari.gestibGrup);
    }
    return this.fromJSON(usuari);
  }

  static async getByGestibId(id:string): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile-by-gestib-codi/'+id);
    const usuari:any = await responseUser.data;
    if(usuari.gestibGrup){
      usuari.grup=await GrupService.getByGestibIdentificador(usuari.gestibGrup);
    }
    return this.fromJSON(usuari);
  }

  static async fromJSON(json:any,includeGrup:boolean=true):Promise<Usuari>{
    return {
      id: json.idusuari,
      email: json.gsuiteEmail,
      nom: json.gestibNom,
      cognom1: json.gestibCognom1,
      cognom2: json.gestibCognom2,
      nomComplet: json.gsuiteFullName,
      expedient: json.gestibExpedient,
      esAlumne: json.gestibAlumne,
      esProfessor: json.gestibProfessor,
      grup: (json.gestibGrup && includeGrup)?await GrupService.getByGestibIdentificador(json.gestibGrup):undefined,
      label: json.gestibCognom1 + ' ' + json.gestibCognom2 + ', '+ json.gestibNom,
      value: json.idusuari
    }
  }
}
