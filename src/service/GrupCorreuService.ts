import {axios} from "boot/axios";
import {GrupCorreu} from "src/model/google/GrupCorreu";
import {UsuariService} from "src/service/UsuariService";

export class GrupCorreuService {
  static async findAll(): Promise<Array<GrupCorreu>> {
    const responseGroups = await axios.get(process.env.API + '/api/core/grupcorreu/llistat');
    const dataGroups = await responseGroups.data;
    return dataGroups.map((grupCorreu: any): GrupCorreu => {
      return this.fromJSON(grupCorreu);
    });
  }

  static async getGrupAmbUsuaris(grup:GrupCorreu): Promise<GrupCorreu> {
      const response = await axios.get(process.env.API + '/api/core/grupcorreu/grupambusuaris/'+grup.email);
      const grupCorreu = await response.data;
      return this.fromJSON(grupCorreu);
  }

  static fromJSON(json:any):GrupCorreu{
    return {
      id: json.idgrup,
      email: json.gsuiteEmail,
      nom: json.gsuiteNom,
      descripcio: json.gsuiteDescripcio,
      tipus: json.grupCorreuTipus,
      usuaris: (json.usuaris)?json.usuaris.map((u:any)=>UsuariService.fromJSON(u)):undefined,
      label: json.gsuiteNom,
      value: json.idgrup
    }
  }
}
