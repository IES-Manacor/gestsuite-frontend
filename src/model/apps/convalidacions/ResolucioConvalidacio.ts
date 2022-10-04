import {ItemConvalidacio} from "src/model/apps/convalidacions/ItemConvalidacio";

export enum EstatResolucioConvalidacio {
  APROVAT="APROVAT",DENEGAT="DENEGAT",PREAPROVAT="PREAPROVAT",PENDENT="PENDENT"
}

export interface ResolucioConvalidacio {
  id?: number;
  estat: EstatResolucioConvalidacio;
  qualificacio: string;
  estudi: ItemConvalidacio;
  observacions: string;
  label?: string;
  value?: string;
}
