import {axios}  from 'boot/axios'
import {Item} from "src/model/apps/grupsCooperatius/Item";
import {ValorItem} from "src/model/apps/grupsCooperatius/ValorItem";
import {Agrupament} from "src/model/apps/grupsCooperatius/Agrupament";
import {GrupCooperatiu} from "src/model/apps/grupsCooperatius/GrupCooperatiu";
import {Membre} from "src/model/apps/grupsCooperatius/Membre";
import {ItemGrupCooperatiu} from "src/model/apps/grupsCooperatius/ItemGrupCooperatiu";

export class GrupCooperatiuService {


  static async getItemById(id:number): Promise<Item> {
    const response = await axios.get(process.env.API + '/api/grupscooperatius/item/' + id);
    const data = await response.data;
    return {
      id: data.iditem,
      nom: data.nom
    }
  }

  static async getItems(): Promise<Array<Item>> {
    const response = await axios.get(process.env.API + '/api/grupscooperatius/items');
    const data = await response.data;
    return data.map((item:any):Item=>{
        return {
          id: item.iditem,
          nom: item.nom
        }
    });
  }

  static async getValorItems(item:Item):Promise<Array<ValorItem>> {
    const responseValors = await axios.get(process.env.API + '/api/grupscooperatius/item/valors/' + item.id);
    const dataValors = await responseValors.data;

    return dataValors.map((valorItem:any):ValorItem=>{
      return {
        id: valorItem.idvalorItem,
        pes: valorItem.pes,
        valor: valorItem.valor,
        item: item
      }
    })
  }

  static async save(item:Item):Promise<void>{
    console.log("Desant ítem...");
    await axios.post(process.env.API + '/api/grupscooperatius/item/desar',item);
  }


  //Grups Cooperatius
  static async getGrupsCooperatiuById(id:number): Promise<GrupCooperatiu> {
    const response = await axios.get(process.env.API + '/api/grupscooperatius/grupcooperatiu/' + id);
    const data = await response.data;
    return {
      id: data.idgrupCooperatiu,
      nom: data.nom,
      itemsGrupCooperatiu: data.itemsGrupsCooperatius.map((igc:any)=>{
        igc.item = {
          id: igc.item.iditem,
          nom: igc.item.nom
        } as Item

        return igc
      }),
      membres: data.membres.map((m:any)=>{
        //console.log("Membre",m)
        m.valorsItemMapped = m.valorsItemMembre.map((vim:any)=>{
          //console.log(vim)
          return {
            label:vim.valorItem.valor + ' (' + vim.valorItem.pes+'%)',
            value:vim.valorItem.idvalorItem+''
          }
        })

        return m;
      }),
      agrupaments: data.agrupaments
    }
  }

  static async getGrupsCooperatius(): Promise<Array<GrupCooperatiu>> {
    const response = await axios.get(process.env.API + '/api/grupscooperatius/grupscooperatiususuari');
    const data = await response.data;
    return data.map((grupCooperatiu:any):GrupCooperatiu=>{
      return {
        id: grupCooperatiu.idgrupCooperatiu,
        nom: grupCooperatiu.nom,
        agrupaments: grupCooperatiu.agrupaments,
        itemsGrupCooperatiu: grupCooperatiu.itemsGrupsCooperatius,
        membres: grupCooperatiu.membres
      }
    });
  }

  static async saveMescla(grupCooperatiu:GrupCooperatiu,resultat:Agrupament[],members:Membre[],numGrups:number):Promise<void>{
    console.log("Desant resultat de la mescla...");
    const req = {
      grupCooperatiu: grupCooperatiu,
      members: members,
      numGrups: numGrups,
      resultat: resultat
    }
    await axios.post(process.env.API + '/api/grupscooperatius/mescla/desar',req);
  }
}
