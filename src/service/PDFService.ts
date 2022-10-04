import {axios} from "boot/axios";
import {Usuari} from "src/model/Usuari";
import {jsPDF} from "jspdf";
import {EstatResolucioConvalidacio} from "src/model/apps/convalidacions/ResolucioConvalidacio";
import {SolicitudConvalidacio} from "src/model/apps/convalidacions/SolicitudConvalidacio";
import moment from 'moment'

export class PDFService {
  static async generateSolicitud(solicitud:SolicitudConvalidacio,download:boolean,signatura?:any,password?:string): Promise<void> {
    moment.locale('ca');

    const alumne = solicitud.alumne!;
    const estudiEnCurs = solicitud.estudisEnCurs;


    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    let y = 40;
    doc.setFontSize(10);

    //console.log(doc.getFontList())
    const lMargin=15; //left margin in mm
    const rMargin=15; //right margin in mm
    const pdfInMM=210;  // width of A4 in mm


    //HEADER
    var img = new Image()
    img.src = '../../../../logos/header_convalidacio.png'

    doc.addImage(img, 'png', 10, 10, 210 - lMargin - rMargin, 25)

    //FETS
    const fets1 = `Vista la sol·licitud de convalidació de mòduls de cicles formatius presentada per ${alumne.nom} ${alumne.cognom1} ${alumne.cognom2}, estudiant de ${estudiEnCurs.nom} en el centre escolar IES Manacor (Manacor) durant el curs 2021-2022.`;
    const linesFets1 =doc.splitTextToSize(fets1, (pdfInMM-lMargin-rMargin));
    const dimFets1 = doc.getTextDimensions(linesFets1);

    doc.setFont("Helvetica","","bold")
    doc.text("Fets", lMargin,y);
    doc.setFont("Helvetica","","normal")


    y += 6;
    if(y + dimFets1.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesFets1,lMargin,y);
    y += dimFets1.h + 6;


    //FONAMENTS DE DRET
    const fonaments1 = `Atès l'article 38 del Reial Decret 1147/2011, de 29 de juliol, pel qual s'estableix l'ordenació general de la formació professional del sistema educatiu;`;
    const linesFonaments1 =doc.splitTextToSize(fonaments1, (pdfInMM-lMargin-rMargin));
    const dimFonaments1 = doc.getTextDimensions(linesFonaments1);

    const fonaments2 = `Atesos els articles 18 i 35 del Decret 91/2012, de 23 de novembre, pel qual s'estableix l'ordenació general de la formació professional del sistema educatiu en el sistema integrat de formació professional a les Illes Balears;`;
    const linesFonaments2 =doc.splitTextToSize(fonaments2, (pdfInMM-lMargin-rMargin));
    const dimFonaments2 = doc.getTextDimensions(linesFonaments2);

    const fonaments3 = `Atès allò disposat al Reial Decret pel qual s'estableix el títol corresponent;`;
    const linesFonaments3 =doc.splitTextToSize(fonaments3, (pdfInMM-lMargin-rMargin));
    const dimFonaments3 = doc.getTextDimensions(linesFonaments3);

    const fonaments4 = `Atès allò disposat al Reial Decret 1085/2020, de 9 de desembre, pel qual s'estableixen convalidacions de mòduls professionals dels títols de Formació Professional del sistema educatiu espanyol i les mesures per a la seva aplicació, i es modifica el Reial Decret 1147/2011, de 29 de juliol.`
    const linesFonaments4 =doc.splitTextToSize(fonaments4, (pdfInMM-lMargin-rMargin));
    const dimFonaments4 = doc.getTextDimensions(linesFonaments4);

    doc.setFont("Helvetica","","bold")
    doc.text("Fonaments de dret", lMargin,y);
    doc.setFont("Helvetica","","normal")

    y += 6;
    if(y + dimFonaments1.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesFonaments1,lMargin,y);
    y += dimFonaments1.h + 6;


    if(y + dimFonaments2.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesFonaments2,lMargin,y);
    y += dimFonaments2.h + 6;


    if(y + dimFonaments3.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesFonaments3,lMargin,y);
    y += dimFonaments3.h + 6;


    if(y + dimFonaments4.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesFonaments4,lMargin,y);
    y += dimFonaments4.h + 6;

    doc.text("Per tot això dict la següent", lMargin,y);
    y += 12;

    //RESOLUCIO
    doc.setFont("Helvetica","","bold")
    doc.text("RESOLUCIÓ", lMargin,y);
    doc.setFont("Helvetica","","normal")
    y += 6;

    const convalidacionsAprovades = solicitud.resolucions.filter(r=>r.estat===EstatResolucioConvalidacio.APROVAT).map(r=>{
      let result = r.estudi.nom.replace(' (**)', '');
      if(r.qualificacio){
        result += ' ('+r.qualificacio+')'
      }
      return result;
    }).join(", ")

    const convalidacionsDenegades = solicitud.resolucions.filter(r=>r.estat===EstatResolucioConvalidacio.DENEGAT).map(r=>{
      let result = r.estudi.nom.replace(' (**)', '');
      if(r.qualificacio){
        result += ' ('+r.qualificacio+')'
      }
      return result;
    }).join("; ")

    const resolucionsAprovades = `D'atorgar al sol·licitant la convalidació en els mòduls ${convalidacionsAprovades}, pels quals l'ha formulat i en queda matriculat, d'acord amb les disposicions legals vigents`
    const linesResolucionsAprovades =doc.splitTextToSize(resolucionsAprovades, (pdfInMM-lMargin-rMargin));
    const dimResolucionsAprovades = doc.getTextDimensions(linesResolucionsAprovades);

    const resolucionsDenegades = `De NO atorgar al sol·licitant la convalidació en els mòduls ${convalidacionsDenegades}, d'acord amb les disposicions legals vigents`
    const linesResolucionsDenegades =doc.splitTextToSize(resolucionsDenegades, (pdfInMM-lMargin-rMargin));
    const dimResolucionsDenegades = doc.getTextDimensions(linesResolucionsDenegades);

    if(convalidacionsAprovades) {
      if (y + dimResolucionsAprovades.h >= 290) {
        doc.addPage();
        y = 20;
      }
      doc.text(linesResolucionsAprovades, lMargin, y);
      y += dimResolucionsAprovades.h + 6;
    }

    if(convalidacionsDenegades) {
      if (y + dimResolucionsDenegades.h >= 290) {
        doc.addPage();
        y = 20;
      }
      doc.text(linesResolucionsDenegades, lMargin, y);
      y += dimResolucionsDenegades.h + 6;
    }

    y += 6;

    //OBSERVACIONS
    const observacions1 = 'Observacions'
    const observacions2 = solicitud.observacions||"";
    const linesObservacions2 =doc.splitTextToSize(observacions2, (pdfInMM-lMargin-rMargin));
    const dimObservacions2 = doc.getTextDimensions(linesObservacions2);

    if(observacions2) {

      doc.setFont("Helvetica","","bold")
      doc.text(observacions1, lMargin,y);
      doc.setFont("Helvetica","","normal")
      y += 6;

      if (y + dimObservacions2.h >= 290) {
        doc.addPage();
        y = 20;
      }
      doc.text(linesObservacions2, lMargin, y);
      y += dimObservacions2.h + 6;

      y += 6;
    }

    //INTERPOSICIÓ DE RECURSOS
    const interposicio1 = `Interposició de recursos`
    const interposicio2 = `Contra aquesta resolució es pot interposar un recurs d'alçada davant la Direcció General de Formació Professional i Ensenyaments Artístics Superiors de la Conselleria d'Educació i Formació Professional del Govern Balear, d'acord amb l'article 58 de la Llei 3/2003, de 26 de març, de règim jurídic de l'Administració de la Comunitat Autònoma de les illes Balears, i l'article 122 de la Llei 39/2015, d'1 d'octubre, del Procediment Administratiu Comú de les Administracions Públiques.`;
    const linesInterposicio2 =doc.splitTextToSize(interposicio2, (pdfInMM-lMargin-rMargin));
    const dimInterposicio2 = doc.getTextDimensions(linesInterposicio2);

    doc.setFont("Helvetica","","bold")
    doc.text(interposicio1, lMargin,y);
    doc.setFont("Helvetica","","normal")
    y += 6;

    if(y + dimInterposicio2.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesInterposicio2,lMargin,y);
    y += dimInterposicio2.h + 6;


    //SIGNATURA
    const avui = moment().format('LLLL');
    const signatura1 = "Signatura";
    const signatura2 = `El present document està signat digitalment per **22116** Miquel Amengual Gayà (R:S0768137B) el ${avui}`
    const linesSignatura2 =doc.splitTextToSize(signatura2, (pdfInMM-lMargin-rMargin));
    const dimSignatura2 = doc.getTextDimensions(linesSignatura2);

    doc.setFont("Helvetica","","bold")
    doc.text(signatura1, lMargin,y);
    doc.setFont("Helvetica","","normal")
    y += 6;

    if(y + dimSignatura2.h >= 290){
      doc.addPage();
      y = 20;
    }
    doc.text(linesSignatura2,lMargin,y);
    y += dimSignatura2.h + 6;

    y += 6;

    //Canvi de pàgina en cas que s'arribi al final
    if (y >= 290) {
      doc.addPage();
      y = 20;
    }
    if(download) {
      console.log(alumne);
      doc.save(alumne.expedient + "-" + alumne.nomComplet + ".pdf");
    } else {
      const pdf = this.dataURItoBlob(doc.output('datauristring'));
      console.log("PDF::::",pdf);
      const formData = new FormData();
      formData.append("arxiu", pdf);
      formData.append("signatura", signatura);
      formData.append("password",password!)
      formData.append("idsolicitud",solicitud.id!.toString());

      const response = await axios.post(
        process.env.API + "/api/convalidacions/pdf/signfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );
    }
  }


  private static dataURItoBlob(dataURI: string):Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }
}
