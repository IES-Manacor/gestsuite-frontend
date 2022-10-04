import {Usuari} from "src/model/Usuari";
import {axios} from "boot/axios";
import {
  UsuariWebIesManacorDepartaments
} from "src/model/apps/webiesmanacordepartaments/UsuariWebIesManacorDepartaments";
import {UsuariService} from "src/service/UsuariService";
import {Curs} from "src/model/gestib/Curs";
import {DepartamentService} from "src/service/DepartamentService";
import {CategoriaConvalidacio} from "src/model/apps/convalidacions/CategoriaConvalidacio";

export class UsuariWebIesManacorDepartamentsService {
  static async findUsuaris(): Promise<Array<UsuariWebIesManacorDepartaments>> {
    const responseUsers = await axios.get(process.env.API + '/api/webiesmanacordepartaments/usuari/llistat');
    const data = await responseUsers.data;
    return data.map((usuari: any): UsuariWebIesManacorDepartaments => {
      return this.fromJSON(usuari)
    }).sort((a: UsuariWebIesManacorDepartaments, b: UsuariWebIesManacorDepartaments) => {
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

  static async getById(id:number): Promise<UsuariWebIesManacorDepartaments> {
    const response = await axios.get(process.env.API + '/api/webiesmanacordepartaments/usuari/getById/' + id);
    const data:any = await response.data;
    return this.fromJSON(data);
  }

  static async save(usuari:UsuariWebIesManacorDepartaments):Promise<void>{
    await axios.post(process.env.API + '/api/webiesmanacordepartaments/usuari/desar',usuari);
  }

  static fromJSON(json:any):UsuariWebIesManacorDepartaments{
    const professor = UsuariService.fromJSON(json.professor)
    return {
      id: json.idUsuari,
      foto: json.foto,
      carrec1: json.carrec1,
      carrec2: json.carrec2,
      carrec3: json.carrec3,
      professor: professor,
      departament: (json.departament)?DepartamentService.fromJSON(json.departament):undefined,
      label: professor.nomComplet,
      value: json.idUsuari
    }
  }
}
