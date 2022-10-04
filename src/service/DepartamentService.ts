import {axios}  from 'boot/axios'
import {Curs} from "src/model/gestib/Curs";
import {Departament} from "src/model/gestib/Departament";
import {
  UsuariWebIesManacorDepartaments
} from "src/model/apps/webiesmanacordepartaments/UsuariWebIesManacorDepartaments";
import {UsuariService} from "src/service/UsuariService";

export class DepartamentService {

  static async getDepartamentById(id:string): Promise<Departament> {
    const response = await axios.get(process.env.API + '/api/core/departament/getById/' + id);
    const data:any = await response.data;
    return this.fromJSON(data)
  }

  static async getDepartamentByCodiGestib(id:string): Promise<Departament> {
    const response = await axios.get(process.env.API + '/api/core/departament/getByCodiGestib/' + id);
    const data = await response.data;
    return this.fromJSON(data)
  }

  static async getDepartaments(): Promise<Array<Departament>> {
    const response = await axios.get(process.env.API + '/api/core/departament/llistat');
    const data = await response.data;
    return data.map((departament:any):Departament=>{
        return this.fromJSON(departament)
    });
  }

  static fromJSON(json:any):Departament{
    return {
      id: json.iddepartament,
      nom: json.gestibNom,
      gestibId: json.gestibIdentificador,
      capDepartament: (json.capDepartament)?UsuariService.fromJSON(json.capDepartament):undefined
    }
  }
}
