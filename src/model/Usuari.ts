import {Grup} from "src/model/gestib/Grup";

export interface Usuari {
  id: number;
  email: string;
  nom: string;
  cognom1: string;
  cognom2: string;
  nomComplet: string;
  expedient?: string;
  esProfessor?: boolean;
  esAlumne?: boolean;
  grup?: Grup,
  label?: string;
  value?: string;
}
