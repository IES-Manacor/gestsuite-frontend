import {Usuari} from "src/model/Usuari";
import {ItemConvalidacio} from "src/model/apps/convalidacions/ItemConvalidacio";
import {ResolucioConvalidacio} from "src/model/apps/convalidacions/ResolucioConvalidacio";
import {FitxerBucket} from "src/model/google/FitxerBucket";

export enum EstatSolicitudConvalidacio {
  RESOLT="RESOLT",PENDENT_SIGNATURA="PENDENT_SIGNATURA",PENDENT_RESOLUCIO="PENDENT_RESOLUCIO",CANCELAT="CANCELAT"
}

export interface SolicitudConvalidacio {
  id?: number;
  estat: EstatSolicitudConvalidacio;
  observacions?: string;
  estudisOrigen: Array<ItemConvalidacio>;
  estudisOrigenManual?: string;
  estudisOrigenObservacions?: string;
  estudisEnCurs: ItemConvalidacio;
  estudisEnCursObservacions?: string;
  resolucions: Array<ResolucioConvalidacio>
  alumne?: Usuari;
  nomAlumneManual?: string;
  cognomsAlumneManual?: string;
  files?: Array<FitxerBucket>;
}
