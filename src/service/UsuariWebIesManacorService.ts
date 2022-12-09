import {axios} from "boot/axios";
import {UsuariWebIesManacor} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";
import {UsuariService} from "src/service/UsuariService";
import {DepartamentService} from "src/service/DepartamentService";

export class UsuariWebIesManacorService {
  static async findUsuaris(): Promise<Array<UsuariWebIesManacor>> {
    const responseUsers = await axios.get(process.env.API + '/api/webiesmanacor/usuari/llistat');
    const data = await responseUsers.data;
    const usuaris:Array<UsuariWebIesManacor> = data.map((usuari: any): Promise<UsuariWebIesManacor> => {
      return this.fromJSON(usuari).then(user=>{
        user.label = user.professor?.cognom1 + ' ' + user.professor?.cognom2 + ", " + user.professor?.nom;
        return user;
      })
    })

    usuaris.sort((a: UsuariWebIesManacor, b: UsuariWebIesManacor) => {
      if ((!a || !a.professor || !a.professor.nomComplet) && (!b || !b.professor || !b.professor.nomComplet)) {
        return 0;
      }
      if (!a || !a.professor || !a.professor.nomComplet) {
        return -1;
      }
      if (!b || !b.professor || !b.professor.nomComplet) {
        return 1;
      }
      return a.professor.nomComplet.localeCompare(b.professor.nomComplet)
    });

    return usuaris;

  }

  static async getById(id:number): Promise<UsuariWebIesManacor> {
    const response = await axios.get(process.env.API + '/api/webiesmanacor/usuari/getById/' + id);
    const data:any = await response.data;
    return this.fromJSON(data);
  }

  static async save(usuari:UsuariWebIesManacor):Promise<void>{
    await axios.post(process.env.API + '/api/webiesmanacor/usuari/desar',usuari);
  }

  static async fromJSON(json:any):Promise<UsuariWebIesManacor>{
    const professor = (json.professor)?await UsuariService.fromJSON(json.professor,false):undefined;
    return {
      id: json.idUsuari,
      nom: json.nom,
      foto: json.foto,
      carrec1: json.carrec1,
      carrec2: json.carrec2,
      carrec3: json.carrec3,
      visible: json.visible,
      professor: professor,
      substitut: (json.substitut)?await this.fromJSON(json.substitut):undefined,
      departament: (json.departament)?await DepartamentService.fromJSON(json.departament):undefined,
      horariAtencioPares: (json.horariAtencioPares)?json.horariAtencioPares:undefined,
      label: professor?.nomComplet||'',
      value: json.idUsuari
    }
  }
}
