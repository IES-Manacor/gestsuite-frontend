import {axios}  from 'boot/axios'
import {Curs} from "src/model/gestib/Curs";

export class CursService {

  static async getCursById(id:string): Promise<Curs> {
    const response = await axios.get(process.env.API + '/api/core/curs/getById/' + id);
    const data:any = await response.data;
    return {
      id: data.idcurs,
      nom: data.gestibNom,
      unitatOrganitzativa: data.gsuiteUnitatOrganitzativa
    }
  }

  static async getCursByCodiGestib(id:string): Promise<Curs> {
    const response = await axios.get(process.env.API + '/api/core/curs/getByCodiGestib/' + id);
    const data = await response.data;
    return {
      id: data.idcurs,
      nom: data.gestibNom,
      unitatOrganitzativa: data.gsuiteUnitatOrganitzativa
    }
  }

  static async getCursos(): Promise<Array<Curs>> {
    const response = await axios.get(process.env.API + '/api/core/curs/llistat');
    const data = await response.data;
    return data.map((curs:any):Curs=>{
        return {
          id: curs.idcurs,
          nom: curs.gestibNom,
          unitatOrganitzativa: curs.gsuiteUnitatOrganitzativa
        }
    });
  }
}
