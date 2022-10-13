import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/gestib/Grup";
import {Departament} from "src/model/gestib/Departament";

export interface Calendari {
  id: number;
  email: string;
  nom: string;
  descripcio: string;
  tipus: string;
  gestibGrup: string;
  usuarisLectura?: Array<Usuari>;
  usuarisEdicio?: Array<Usuari>;
  label?: string;
  value?: string;
}
