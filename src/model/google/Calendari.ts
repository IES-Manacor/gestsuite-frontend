import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/gestib/Grup";
import {Departament} from "src/model/gestib/Departament";
import {GrupCorreu} from "src/model/google/GrupCorreu";

export interface Calendari {
  id: number;
  email: string;
  nom: string;
  descripcio: string;
  tipus: string;
  usuarisLectura?: Array<Usuari>;
  usuarisEdicio?: Array<Usuari>;
  grupCorreuLectura?: Array<GrupCorreu>;
  grupCorreuEdicio?: Array<GrupCorreu>;
  label?: string;
  value?: string;
}
