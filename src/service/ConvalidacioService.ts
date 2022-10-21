import {axios}  from 'boot/axios'
import {CategoriaConvalidacio} from "src/model/apps/convalidacions/CategoriaConvalidacio";
import {ItemConvalidacio} from "src/model/apps/convalidacions/ItemConvalidacio";
import {ConvalidacioConvalidacio} from "src/model/apps/convalidacions/ConvalidacioConvalidacio";
import {EstatSolicitudConvalidacio, SolicitudConvalidacio} from "src/model/apps/convalidacions/SolicitudConvalidacio";
import {Item} from "src/model/apps/grupsCooperatius/Item";
import {ResolucioConvalidacio} from "src/model/apps/convalidacions/ResolucioConvalidacio";
import {Usuari} from "src/model/Usuari";
import {UsuariService} from "src/service/UsuariService";
import {FitxerBucket} from "src/model/google/FitxerBucket";

export class ConvalidacioService {

  //CATEGORIES
  static async getCategoriaById(id:number): Promise<CategoriaConvalidacio> {
    const response = await axios.get(process.env.API + '/api/convalidacions/categoria/' + id);
    const data = await response.data;
    return {
      id: data.idcategoria,
      nom: data.nom
    }
  }

  static async getCategories(): Promise<Array<CategoriaConvalidacio>> {
    const response = await axios.get(process.env.API + '/api/convalidacions/categories');
    const data = await response.data;
    return data.map((categoria:any):CategoriaConvalidacio=>{
        return {
          id: categoria.idcategoria,
          nom: categoria.nom
        }
    });
  }

  static async saveCategoria(categoria:CategoriaConvalidacio):Promise<void>{
    await axios.post(process.env.API + '/api/convalidacions/categoria/desar',categoria);
  }

  static async esborrarCategoria(id:number):Promise<void>{
    console.log("ID",id);
    const categoria:CategoriaConvalidacio = await this.getCategoriaById(id);
    console.log("Categoria",categoria);
    await axios.post(process.env.API + '/api/convalidacions/categoria/esborrar',categoria);
  }

  //TITULACIONS
  static async getTitulacions(isPublic:boolean=false): Promise<Array<ItemConvalidacio>> {
    let publicSite:string = '';
    if(isPublic){
      publicSite='/public';
    }
    const response = await axios.get(process.env.API + '/api/convalidacions'+publicSite+'/titulacions');
    const data = await response.data;
    return data.map((titulacio: any): ItemConvalidacio => {
      titulacio.composa?.map((t:ItemConvalidacio)=>{
        t.selected = true;
        return t;
      })
      return {
        id: titulacio.iditem,
        codi: titulacio.codi,
        nom: titulacio.nom,
        nomOriginal: titulacio.nomOriginal,
        impartitAlCentre: titulacio.impartitAlCentre,
        composa: titulacio.composa,
        categoria: titulacio.categoria,
      }
    });
  }

  static async getTitulacionsImpartidesAlCentre(isPublic:boolean=false): Promise<Array<ItemConvalidacio>> {
    let publicSite:string = '';
    if(isPublic){
      publicSite='/public';
    }
    const response = await axios.get(process.env.API + '/api/convalidacions'+publicSite +'/titulacionscentre');
    const data = await response.data;
    return data.map((titulacio: any): ItemConvalidacio => {
      titulacio.composa?.map((t:ItemConvalidacio)=>{
        t.selected = true;
        return t;
      })
      return {
        id: titulacio.iditem,
        codi: titulacio.codi,
        nom: titulacio.nom,
        nomOriginal: titulacio.nomOriginal,
        impartitAlCentre: titulacio.impartitAlCentre,
        composa: titulacio.composa,
        categoria: titulacio.categoria,
      }
    });
  }

  static async getItems(): Promise<Array<ItemConvalidacio>> {
    const response = await axios.get(process.env.API + '/api/convalidacions/items');
    const data = await response.data;
    const itemsMap = data.map((item: any): Promise<ItemConvalidacio> => {
      return ConvalidacioService.mapToItemConvalidacio(item)
    });
    const itemsResolved = await Promise.all(itemsMap) as Array<ItemConvalidacio>;
    return itemsResolved.sort((a,b)=>(a.codi)?a.codi.localeCompare(b.codi):-1);
  }

  static async getTitulacioById(id:number): Promise<ItemConvalidacio> {
    const response = await axios.get(process.env.API + '/api/convalidacions/titulacio/' + id);
    const data = await response.data;

    const itemComposa = data.composa.map((i:any)=>{
      return ConvalidacioService.mapToItemConvalidacio(i)
    })

    return {
      id: data.iditem,
      codi: data.codi,
      nom: data.nom,
      nomOriginal: data.nomOriginal,
      impartitAlCentre: data.impartitAlCentre,
      categoria: {
        id: data.categoria.idcategoria,
        nom: data.categoria.nom,
        label: data.categoria.nom,
        value: data.categoria.idcategoria
      } as CategoriaConvalidacio,
      composa: await Promise.all(itemComposa) as ItemConvalidacio[]
    }
  }

  static async getTitulacioByNom(nom?:string): Promise<ItemConvalidacio|null> {
    if(!nom){
      return null;
    }
    const response = await axios.get(process.env.API + '/api/convalidacions/item/getbynom/' + nom);
    const dataArray = await response.data;

    if(dataArray && dataArray.length>0) {
      const data = dataArray[0];
      const itemComposa = data.composa.map((i: any) => {
        return ConvalidacioService.mapToItemConvalidacio(i)
      })

      return {
        id: data.iditem,
        codi: data.codi,
        nom: data.nom,
        nomOriginal: data.nomOriginal,
        impartitAlCentre: data.impartitAlCentre,
        categoria: {
          id: data.categoria.idcategoria,
          nom: data.categoria.nom,
          label: data.categoria.nom,
          value: data.categoria.idcategoria
        } as CategoriaConvalidacio,
        composa: await Promise.all(itemComposa) as ItemConvalidacio[]
      }
    }
    return null;
  }

  static async getTitulacioByCodi(codi?:string): Promise<ItemConvalidacio|null> {
    if(!codi){
      return null;
    }
    const response = await axios.get(process.env.API + '/api/convalidacions/item/getbycodi/' + codi);
    const dataArray = await response.data;

    if(dataArray && dataArray.length>0) {
      const data = dataArray[0];
      const itemComposa = data.composa.map((i: any) => {
        return ConvalidacioService.mapToItemConvalidacio(i)
      })

      return {
        id: data.iditem,
        codi: data.codi,
        nom: data.nom,
        nomOriginal: data.nomOriginal,
        impartitAlCentre: data.impartitAlCentre,
        categoria: {
          id: data.categoria.idcategoria,
          nom: data.categoria.nom,
          label: data.categoria.nom,
          value: data.categoria.idcategoria
        } as CategoriaConvalidacio,
        composa: await Promise.all(itemComposa) as ItemConvalidacio[]
      }
    }
    return null;
  }

  static async saveTitulacio(titulacio:ItemConvalidacio):Promise<void>{
    await axios.post(process.env.API + '/api/convalidacions/titulacio/desar',titulacio);
  }

  static async esborrarTitulacio(id:number):Promise<void>{
    console.log("ID",id);
    const titulacio:ItemConvalidacio = await this.getTitulacioById(id);
    await axios.post(process.env.API + '/api/convalidacions/titulacio/esborrar',titulacio);
  }


  //CONVALIDACIONS
  static async getConvalidacions(): Promise<Array<ConvalidacioConvalidacio>> {
    const response = await axios.get(process.env.API + '/api/convalidacions/convalidacio/llistat');
    const data = await response.data;
    const dataMap = data.map(async (convalidacio: any): Promise<ConvalidacioConvalidacio> => {
      const origensMap = convalidacio.origens.map((i:any):Promise<ItemConvalidacio>=>{
        return ConvalidacioService.mapToItemConvalidacio(i)
      })
      const origensResolt= await Promise.all(origensMap);

      const convalidaMap = convalidacio.convalida.map((i:any):Promise<ItemConvalidacio>=>{
        return ConvalidacioService.mapToItemConvalidacio(i)
      })
      const convalidaResolt= await Promise.all(convalidaMap);

      return {
        id: convalidacio.idconvalidacio,
        origens: origensResolt as ItemConvalidacio[],
        convalida: convalidaResolt as ItemConvalidacio[],
      }
    });
    return await Promise.all(dataMap) as Array<ConvalidacioConvalidacio>;
  }

  static async saveConvalidacio(convalidacio:ConvalidacioConvalidacio):Promise<void>{
    await axios.post(process.env.API + '/api/convalidacions/convalidacio/desar',convalidacio);
  }

  static async getConvalidacioById(id:number): Promise<ConvalidacioConvalidacio> {
    const response = await axios.get(process.env.API + '/api/convalidacions/convalidacio/' + id);
    const data = await response.data;

    const origensMap = data.origens.map((i:any):Promise<ItemConvalidacio>=>{
      return ConvalidacioService.mapToItemConvalidacio(i)
    })
    const origensResolt= await Promise.all(origensMap);
    //console.log("Origens resolts",origensResolt);

    return {
      id: data.idconvalidacio as number,
      origens: origensResolt as Array<ItemConvalidacio>,
      convalida: data.convalida.map((i:any):Promise<ItemConvalidacio>=>{
        return ConvalidacioService.mapToItemConvalidacio(i)
      }) as Array<ItemConvalidacio>,
    }
  }

  static async esborrarConvalidacio(id:number):Promise<void>{
    console.log("ID",id);
    const convalidacio:ConvalidacioConvalidacio = await this.getConvalidacioById(id);
    console.log("Convalidacio",convalidacio);
    await axios.post(process.env.API + '/api/convalidacions/convalidacio/esborrar',convalidacio);
  }


  //SOL·LICITUDS
  static async getSolicituds(): Promise<Array<SolicitudConvalidacio>> {
    const response = await axios.get(process.env.API + '/api/convalidacions/solicitud/llistat');
    const data = await response.data;
    const map = data.map(async (solicitud: any): Promise<SolicitudConvalidacio> => {
      return await ConvalidacioService.getSolicitudById(solicitud.idsolicitud);
    });
    return map;
  }

  static async getSolicitudById(id:number): Promise<SolicitudConvalidacio> {
    const response = await axios.get(process.env.API + '/api/convalidacions/solicitud/' + id);
    const data = await response.data;

    //Estudis cursats anteriorment
    const origensMap = data.estudisOrigen.map((i:any):Promise<ItemConvalidacio>=>{
      return ConvalidacioService.mapToItemConvalidacio(i)
    })
    const origensResolt= await Promise.all(origensMap);
    //console.log("Origens resolts",origensResolt);

    const encurs = await ConvalidacioService.mapToItemConvalidacio(data.estudisEnCurs);

    let alumne:Usuari|null = null;
    if(data.alumne) {
      const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile/'+data.alumne);
      const usuari = await responseUser.data;
      alumne = {
        id: usuari.idusuari,
        email: usuari.gsuiteEmail,
        nom: usuari.gestibNom,
        cognom1: usuari.gestibCognom1,
        cognom2: usuari.gestibCognom2,
        nomComplet: usuari.gsuiteFullName,
        expedient: usuari.gestibExpedient,
        esAlumne: usuari.gestibAlumne,
        esProfessor: usuari.gestibProfessor,
      };
    }

    let fitxersAlumne:FitxerBucket[]|null = null;
    if(data.fitxersAlumne){
      fitxersAlumne = [];
      for(const idFitxerBucket of data.fitxersAlumne) {
        const f: any = await axios.get(process.env.API + '/api/core/fitxerbucket/' + idFitxerBucket);
        const fitxerBucket: FitxerBucket = f.data;
        if (fitxerBucket){
          const url: any = await axios.post(process.env.API + '/api/core/googlestorage/generate-signed-url', fitxerBucket);
          fitxerBucket.url = url.data;

          fitxersAlumne.push(fitxerBucket);
        }
      }
    }

    let fitxerResolucio:FitxerBucket|null = null;
    if(data.fitxerResolucio){
      const f: any = await axios.get(process.env.API + '/api/core/fitxerbucket/' + data.fitxerResolucio);
      const fitxerBucket: FitxerBucket = f.data;
      if (fitxerBucket){
        const url: any = await axios.post(process.env.API + '/api/core/googlestorage/generate-signed-url', fitxerBucket);
        fitxerBucket.url = url.data;

        fitxerResolucio = fitxerBucket;
      }
    }

    return{
      id: data.idsolicitud as number,
      alumne: alumne as Usuari,
      estat: data.estat as EstatSolicitudConvalidacio,
      estudisEnCurs: encurs as ItemConvalidacio,
      estudisEnCursObservacions: data.estudisEnCursObservacions as string,
      estudisOrigen: origensResolt as ItemConvalidacio[],
      estudisOrigenManual: data.estudisOrigenManual as string,
      estudisOrigenObservacions: data.estudisOrigenObservacions,
      observacions: data.observacions as string,
      resolucions: data.resolucions as ResolucioConvalidacio[],
      nomAlumneManual: data.nomAlumneManual,
      cognomsAlumneManual: data.cognomsAlumneManual,
      files: fitxersAlumne as FitxerBucket[],
      fitxerResolucio: fitxerResolucio as FitxerBucket
    }
  }

  static async esborrarSolicitud(id:number):Promise<void>{
    console.log("ID",id);
    const solicitud:SolicitudConvalidacio = await this.getSolicitudById(id);
    await axios.post(process.env.API + '/api/convalidacions/solicitud/esborrar',solicitud);
  }

  static async calcularConvalidacions(solicitud:SolicitudConvalidacio,isPublic:boolean=false): Promise<Array<ItemConvalidacio>> {
    let publicSite:string = '';
    if(isPublic){
      publicSite='/public';
    }

    //Tipus any: per poder tenir alumne només la ID, no l'objecte Usuari
    const solicitudFiltered:any = Object.assign({},solicitud);
    solicitudFiltered.estudisOrigen = solicitudFiltered.estudisOrigen?.map((e:ItemConvalidacio)=>{
      const est = Object.assign({},e);
      est.composa = est.composa!.filter((i:ItemConvalidacio)=>i.selected);
      return est;
    })
    solicitudFiltered.alumne = solicitud.alumne?.id;

    const response = await axios.post(process.env.API + '/api/convalidacions'+publicSite+'/solicitud/calculconvalidacio',solicitudFiltered);
    const data = await response.data;
    return data.map((titulacio: any): ItemConvalidacio => {
      titulacio.composa?.map((t:ItemConvalidacio)=>{
        t.selected = true;
        return t;
      })
      return {
        id: titulacio.iditem,
        codi: titulacio.codi,
        nom: titulacio.nom,
        nomOriginal: titulacio.nomOriginal,
        impartitAlCentre: titulacio.impartitAlCentre,
        composa: titulacio.composa,
        categoria: titulacio.categoria,
      }
    });
  }

  static async saveSolicitud(solicitud:SolicitudConvalidacio):Promise<void>{
    await axios.post(process.env.API +'/api/convalidacions/solicitud/desar',solicitud);
  }

  static async saveSolicitudPublic(solicitud:SolicitudConvalidacio):Promise<void>{
    await axios.post(process.env.API +'/api/convalidacions/public/solicitud/desar',solicitud);
  }

  //PDF
  static async generarPDF():Promise<void>{
    //const solicitud:SolicitudConvalidacio = await this.getConvalidacioById(id);
    await axios.post(process.env.API + '/api/convalidacions/pdf/hello');
  }

  /**
   * @param item
   * @param isPublic
   * @param items paràmetre per obtenir l'ítem pare. Si no es passa aquest paràmetre, la informàció de l'ítem serà sense el pare.
   */
  static async mapToItemConvalidacio(item:any,isPublic:boolean=false,items?:ItemConvalidacio[]):Promise<ItemConvalidacio>{
    let publicSite:string = '';
    if(isPublic){
      publicSite='/public';
    }
    const itemConvalidacio:ItemConvalidacio = {
        id: item.iditem,
        codi: item.codi,
        nom: item.nom,
        nomOriginal: item.nomOriginal,
        impartitAlCentre: item.impartitAlCentre,
        categoria: {
          id: item.categoria.idcategoria,
          nom: item.categoria.nom,
          label: item.categoria.nom,
          value: item.categoria.idcategoria
        } as CategoriaConvalidacio,
        composa: item.composa.map((i:any)=>{
          return {
            id: i.iditem,
            codi: i.codi,
            nom: i.nom,
            nomOriginal: i.nomOriginal,
            impartitAlCentre: i.impartitAlCentre,
            categoria: {
              id: i.categoria.idcategoria,
              nom: i.categoria.nom,
              label: i.categoria.nom,
              value: i.categoria.idcategoria
            } as CategoriaConvalidacio
          }
        })
      }


      //const responseItems = await axios.get(process.env.API + publicSite +'/apps/convalidacions/items');
      //const items:ItemConvalidacio[] = await responseItems.data;

      //Item pare
      let itemsPare:Array<ItemConvalidacio>|undefined = undefined;
      if(items){
        itemsPare = items.filter((itemp:any)=>{
          return itemp.composa?.find((i:any)=> {
            //console.log(i.iditem, itemConvalidacio.id)
            return i.iditem === itemConvalidacio.id
          })
        });
        //console.log("item pare",itemPare)
      }


      if(!itemsPare || itemsPare.length==0){
        itemConvalidacio.label = `${item.codi+' - ' || ''}${item.nom} (${item.categoria.nom})`
      } else {
        let str = `${item.codi+' - ' || ''}${item.nom} (${item.categoria.nom}). Títols: `;
        str = str + itemsPare.map(item=>`${(item.codi)?item.codi+' - ':''}${item.nom} (${item.categoria.nom})`).join(', ');
        itemConvalidacio.label = str;
      }

      //itemConvalidacio.label = `${item.codi+' - ' || ''}${item.nom} (${item.categoria.nom})`
      itemConvalidacio.value = item.iditem;
      return itemConvalidacio;
  }
}
