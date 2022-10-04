import {Usuari} from "src/model/Usuari";
import {ItemGrupCooperatiu} from "src/model/apps/grupsCooperatius/ItemGrupCooperatiu";
import {Agrupament} from "src/model/apps/grupsCooperatius/Agrupament";
import {Membre} from "src/model/apps/grupsCooperatius/Membre";

export interface GrupCooperatiu {
  id?: number;
  nom: string;
  itemsGrupCooperatiu: Array<ItemGrupCooperatiu>;
  agrupaments: Array<Agrupament>;
  membres: Array<Membre>;
}
