import {Usuari} from "src/model/Usuari";

export interface Grup {
  id: number;
  nom: string;
  tutor1?: Usuari;
  tutor2?: Usuari;
  tutor3?: Usuari;
}
