import {axios}  from 'boot/axios'
import {Curs} from "src/model/gestib/Curs";
import {Grup} from "src/model/gestib/Grup";
import {Usuari} from "src/model/Usuari";

export class GrupService {

  static async getGrupsByCurs(curs:Curs,includeTutorsGrup:boolean=false): Promise<Array<Grup>> {
    const response = await axios.get(process.env.API + '/api/core/grup/findByCurs/'+curs.id);
    const grups = await response.data;

    if(includeTutorsGrup) {
      for (let grup of grups) {
        if (grup.gestibTutor1) {
          const response = await axios.get(process.env.API + '/api/core/usuaris/profile-by-gestib-codi/' + grup.gestibTutor1);
          const usuari:any = await response.data;
          grup.gestibTutor1 =  {
            id: usuari.idusuari,
            email: usuari.gsuiteEmail,
            nom: usuari.gestibNom,
            cognom1: usuari.gestibCognom1,
            cognom2: usuari.gestibCognom2,
            nomComplet: usuari.gsuiteFullName,
            expedient: usuari.gestibExpedient,
            esAlumne: usuari.gestibAlumne,
            esProfessor: usuari.gestibProfessor,
            label: usuari.gsuiteFullName,
            value: usuari.idusuari
          };
        }

        if (grup.gestibTutor2) {
          const response = await axios.get(process.env.API + '/api/core/usuaris/profile-by-gestib-codi/' + grup.gestibTutor2);
          const usuari:any = await response.data;
          grup.gestibTutor2 = {
            id: usuari.idusuari,
            email: usuari.gsuiteEmail,
            nom: usuari.gestibNom,
            cognom1: usuari.gestibCognom1,
            cognom2: usuari.gestibCognom2,
            nomComplet: usuari.gsuiteFullName,
            expedient: usuari.gestibExpedient,
            esAlumne: usuari.gestibAlumne,
            esProfessor: usuari.gestibProfessor,
            label: usuari.gsuiteFullName,
            value: usuari.idusuari
          };
        }

        if (grup.gestibTutor3) {
          const response = await axios.get(process.env.API + '/api/core/usuaris/profile-by-gestib-codi/' + grup.gestibTutor3);
          const usuari:any = await response.data;
          grup.gestibTutor3 = {
            id: usuari.idusuari,
            email: usuari.gsuiteEmail,
            nom: usuari.gestibNom,
            cognom1: usuari.gestibCognom1,
            cognom2: usuari.gestibCognom2,
            nomComplet: usuari.gsuiteFullName,
            expedient: usuari.gestibExpedient,
            esAlumne: usuari.gestibAlumne,
            esProfessor: usuari.gestibProfessor,
            label: usuari.gsuiteFullName,
            value: usuari.idusuari
          };
        }
      }
    }

    return grups.map((grup:any)=>{
      return {
        id: grup.idgrup,
        nom: grup.gestibNom,
        tutor1: grup.gestibTutor1,
        tutor2: grup.gestibTutor2,
        tutor3: grup.gestibTutor3
      }
    });
  }
}
