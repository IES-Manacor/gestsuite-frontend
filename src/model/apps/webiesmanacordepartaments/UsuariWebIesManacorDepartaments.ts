import {Usuari} from "src/model/Usuari";
import {Departament} from "src/model/gestib/Departament";

export interface UsuariWebIesManacorDepartaments {
  id?: number;
  foto?: string;
  carrec1?: string;
  carrec2?: string;
  carrec3?: string;
  professor?: Usuari;
  departament?: Departament;
  substitut?: UsuariWebIesManacorDepartaments;
  label?: string;
  value?: string;
}
