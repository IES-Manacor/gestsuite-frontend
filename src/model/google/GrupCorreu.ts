import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/gestib/Grup";
import {Departament} from "src/model/gestib/Departament";

export interface GrupCorreu {
  id: number;
  email: string;
  nom: string;
  descripcio: string;
  tipus: string;
  usuaris?: Array<Usuari>;
  grupCorreus?: Array<GrupCorreu>;
  grups?: Array<Grup>;
  departaments?: Array<Departament>;
  label?: string;
  value?: string;
}
