import {GrupCooperatiu} from "src/model/apps/grupsCooperatius/GrupCooperatiu";
import {Membre} from "src/model/apps/grupsCooperatius/Membre";

export interface Agrupament {
  id?: number;
  grupCooperatiu: GrupCooperatiu;
  membres: Array<Membre>;
  numero: number;
}
