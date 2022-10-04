import {axios} from "boot/axios";
import {Usuari} from "src/model/Usuari";

export class UsuariService {
  static async findUsuarisActius(): Promise<Array<Usuari>> {
    const responseUsers = await axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
    const data = await responseUsers.data;
    return data.map((usuari:any):Usuari=>{
      return this.fromJSON(usuari)
    }).sort((a:Usuari,b:Usuari)=>{
      if( (!a || !a.nomComplet) && (!b || !b.nomComplet) ){
        return 0;
      }
      if(!a || !a.nomComplet){
        return -1;
      }
      if(!b || !b.nomComplet){
        return 1;
      }
      return a.nomComplet.localeCompare(b.nomComplet)
    });
  }

  static async getById(id:number): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile/'+id);
    const usuari:Usuari = await responseUser.data;
    return usuari;
  }

  static fromJSON(json:any):Usuari{
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
      label: json.gestibCognom1 + ' ' + json.gestibCognom2 + ', '+ json.gestibNom,
      value: json.idusuari
    }
  }
}
