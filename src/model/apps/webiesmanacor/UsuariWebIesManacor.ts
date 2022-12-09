import {Usuari} from "src/model/Usuari";
import {Departament} from "src/model/gestib/Departament";

export interface UsuariWebIesManacor {
  id?: number;
  nom: string;
  foto?: string;
  carrec1?: string;
  carrec2?: string;
  carrec3?: string;
  visible: boolean;
  professor?: Usuari;
  departament?: Departament;
  substitut?: UsuariWebIesManacor;
  horariAtencioPares?: string;
  label?: string;
  value?: string;
}
