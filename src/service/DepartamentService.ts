import {axios}  from 'boot/axios'
import {Departament} from "src/model/gestib/Departament";
import {UsuariService} from "src/service/UsuariService";

export class DepartamentService {

  prova(){}

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
    return Promise.all(data.map(async (departament:any):Promise<Departament>=>{
        return await this.fromJSON(departament)
    }));
  }

  static async generarScriptDepartament(id:number) {
    await axios.post(process.env.API + '/api/webiesmanacor/departament/generarScript',{
      id:id
    });
  }

  static async recuperarBackupScriptDepartament(id:number) {
    await axios.post(process.env.API + '/api/webiesmanacor/departament/recuperarBackupScript',{
      id:id
    });
  }

  static async fromJSON(json:any):Promise<Departament>{
    return {
      id: json.iddepartament,
      nom: json.gestibNom,
      gestibId: json.gestibIdentificador,
      capDepartament: (json.capDepartament)?await UsuariService.fromJSON(json.capDepartament):undefined
    }
  }
}
