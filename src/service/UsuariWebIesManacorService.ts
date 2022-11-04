import {Usuari} from "src/model/Usuari";
import {axios} from "boot/axios";
import {
  UsuariWebIesManacor
} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";
import {UsuariService} from "src/service/UsuariService";
import {Curs} from "src/model/gestib/Curs";
import {DepartamentService} from "src/service/DepartamentService";
import {CategoriaConvalidacio} from "src/model/apps/convalidacions/CategoriaConvalidacio";

export class UsuariWebIesManacorService {
  static async findUsuaris(): Promise<Array<UsuariWebIesManacor>> {
    const responseUsers = await axios.get(process.env.API + '/api/webiesmanacor/usuari/llistat');
    const data = await responseUsers.data;
    return data.map(async (usuari: any): Promise<UsuariWebIesManacor> => {
      return await this.fromJSON(usuari)
    }).sort((a: UsuariWebIesManacor, b: UsuariWebIesManacor) => {
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
    const professor = await UsuariService.fromJSON(json.professor)
    return {
      id: json.idUsuari,
      foto: json.foto,
      carrec1: json.carrec1,
      carrec2: json.carrec2,
      carrec3: json.carrec3,
      professor: professor,
      departament: (json.departament)?await DepartamentService.fromJSON(json.departament):undefined,
      horariAtencioPares: (json.horariAtencioPares)?json.horariAtencioPares:undefined,
      label: professor.nomComplet,
      value: json.idUsuari
    }
  }
}
