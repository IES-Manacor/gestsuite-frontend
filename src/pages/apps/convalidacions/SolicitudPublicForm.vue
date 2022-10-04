<template>
  <q-page class="flex column background" padding style="max-width: 1000px; margin: 0 auto;">

    <p class="q-mx-auto">
      <q-img
        src="../../../../public/logoiesmanacor.png"
        width="300px"
        alt="Logo IES Manacor"
      />
    </p>
    <p class="text-h2 q-mb-lg">
      Sol·licitud de convalidacions
    </p>


    <p class="text-h3 q-mt-lg">Dades Personals</p>

    <div class="row">
      <q-input class="col-6" v-model="solicitud.nomAlumneManual" label="Nom" />
      <q-input class="col-6 q-gutter-lg q-col-gutter-x-lg" v-model="solicitud.cognomsAlumneManual" label="Cognoms" />
    </div>

    <p class="text-h3  q-mt-lg">Estudis cursats anteriorment</p>

    <q-select
      filled
      v-model="solicitud.estudisOrigen"
      use-input
      input-debounce="0"
      label="Titulació"
      multiple
      :options="titulacionsFiltered"
      @filter="titulacioFilterFn"
      @input-value="calcularConvalidacions"
      @update:model-value="calcularConvalidacions"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <div v-for="estudiOrigen in solicitud.estudisOrigen">
      <p class="text-h6">- {{estudiOrigen.categoria.nom}}: {{estudiOrigen.codi}}-{{estudiOrigen.nom}}</p>
      <div v-if="estudiOrigen.composa && estudiOrigen.composa.length > 0">
        <q-list>
          <q-item v-for="item in estudiOrigen.composa" clickable dense class="q-mb-md">
            <q-item-section top class="col-10 q-ma-none flex row">
              <q-checkbox @update:model-value="calcularConvalidacions" v-model="item.selected" :label="item.codi+'-'+item.nom+' ('+item.categoria.nom+')'"/>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>


    <q-checkbox class="q-mt-md" v-model="estudisOrigenManualChecked" label="Tinc estudis cursats que no apareixen al llistat"/>
    <q-input
      v-model="solicitud.estudisOrigenManual"
      label="Especifiqui els estudis cursats addicionals"
      filled
      autogrow
      type="textarea"
      :disable="!estudisOrigenManualChecked"
    >
      <template v-slot:hint>
        Emplenar aquest camp només si els estudis cursats anteriorment no apareixen al llistat
      </template>
    </q-input>

    <q-input
      class="q-mt-md"
      v-model="solicitud.estudisOrigenObservacions"
      label="Observacions sobre els estudis cursats anteriorment"
      filled
      autogrow
      type="textarea"
    />


    <p class="text-h3 q-mt-lg">Estudis actuals</p>

    <q-select
      filled
      v-model="solicitud.estudisEnCurs"
      use-input
      input-debounce="0"
      label="Estudis en curs al centre"
      :options="titulacionsCentreFiltered"
      @filter="titulacioFilterFn"
      @input-value="calcularConvalidacions"
      @update:model-value="calcularConvalidacions"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <p class="text-h3 q-mt-lg">Convalidacions</p>
    <q-list>
      <q-item v-for="resolucio in solicitud.resolucions" clickable dense class="q-mb-md">
        <q-item-section top class="col-10 q-ma-none flex row">
          <q-checkbox v-model="resolucio.estudi.selected" :label="resolucio.estudi.codi+'-'+resolucio.estudi.nom+' ('+resolucio.estudi.categoria.nom+')'"/>
          <div v-if="resolucio.estudi.selected">
            <p>{{mapEstatResolucioToLabel(resolucio.estat)}}</p>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <p>Nota: les convalidacions marcades amb un asterisc (**) són automàtiques. Es faran efectives una vegada revisada la documentació per part de l'administració del centre.</p>

    <q-input
      class="q-my-md"
      v-model="solicitud.estudisEnCursObservacions"
      label="Observacions sobre els estudis que vol convalidar"
      filled
      autogrow
      type="textarea"
    />

    <p class="text-h3 q-mt-lg">Documents aportats</p>

    <q-uploader
      field-name="file"
      with-credentials
      :url="urlUpload"
      label="Documentació aportada per part de l'alumne"
      multiple
      class="q-my-lg"
      style="width: 100%"
      auto-upload
      @uploaded="uploadfile"
    />

    <q-banner v-if="msgstatus" inline-actions class="text-white bg-red q-my-md">
      {{msgstatus}}
    </q-banner>

    <div class="flex justify-end">
      <q-btn class="q-mr-md" color="primary" icon="save" label="Demana Convalidacions" @click="save" />
    </div>

  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ItemConvalidacio} from "src/model/apps/convalidacions/ItemConvalidacio";
import {ConvalidacioService} from "src/service/ConvalidacioService";
import {Usuari} from "src/model/Usuari";
import ConvalidacioListMenu from 'components/ConvalidacioList_Menu.vue';
import {SolicitudConvalidacio} from "src/model/apps/convalidacions/SolicitudConvalidacio";
import {UsuariService} from "src/service/UsuariService";
import {jsPDF} from "jspdf";
import {EstatResolucioConvalidacio, ResolucioConvalidacio} from "src/model/apps/convalidacions/ResolucioConvalidacio";
import {PDFService} from "src/service/PDFService";


export default defineComponent({
  name: 'SolicitudForm',
  data() {
    return {
      solicitud: {} as SolicitudConvalidacio,
      estudisOrigenManualChecked: false,
      titulacions: [] as ItemConvalidacio[],
      titulacionsCentre: [] as ItemConvalidacio[],
      titulacionsFiltered: [] as ItemConvalidacio[],
      titulacionsCentreFiltered: [] as ItemConvalidacio[],
      msgstatus: '',
      urlUpload: process.env.API + '/api/convalidacions/public/solicitud/upload'
    }
  },
  components: { ConvalidacioListMenu },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      const dialog = await this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      const titulacions:ItemConvalidacio[] = await  ConvalidacioService.getTitulacions(true);
      this.titulacions = titulacions.map((titulacio:ItemConvalidacio)=>{
        titulacio.label = "";
        if(titulacio.codi){
          titulacio.label +=  titulacio.codi+" - ";
        }
        titulacio.label += titulacio.nom + ' ('+titulacio.categoria.nom+')';
        titulacio.value = titulacio.id!.toString();
        return titulacio;
      }).sort((a,b)=>a.label!.localeCompare(b.label!));
      this.titulacionsFiltered = this.titulacions

      const titulacionsCentre:ItemConvalidacio[] = await  ConvalidacioService.getTitulacionsImpartidesAlCentre(true);
      this.titulacionsCentre = titulacionsCentre.map((titulacio:ItemConvalidacio)=>{
        titulacio.label = "";
        if(titulacio.codi){
          titulacio.label +=  titulacio.codi+"-";
        }
        titulacio.label += titulacio.nom + ' ('+titulacio.categoria.nom+')';
        titulacio.value = titulacio.id!.toString();
        return titulacio;
      }).sort((a,b)=>a.label!.localeCompare(b.label!));
      this.titulacionsCentreFiltered = this.titulacionsCentre

      await dialog.hide();
    },
    titulacioFilterFn (val:string, update:Function) {
      if (val === '') {
        update(() => {
          this.titulacionsFiltered = this.titulacions;
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.titulacionsFiltered = this.titulacions.filter(i=>i.label!.toLowerCase().indexOf(needle) > -1 || false);
      })
    },
    calcularConvalidacions: function(){
      //Necessitem fer el next Tick perquè el model s'actualitza després de la cridada.
      this.$nextTick(async function () {
        const convalidacions = await ConvalidacioService.calcularConvalidacions(this.solicitud,true)

        let resolucionsOld = new Array<ResolucioConvalidacio>();
        if(this.solicitud.resolucions) {
          resolucionsOld = [...this.solicitud.resolucions];
        }

        this.solicitud.resolucions = new Array<ResolucioConvalidacio>();

        const estudisEnCurs:ItemConvalidacio[]|undefined = this.solicitud.estudisEnCurs?.composa?.sort((a,b)=>(a.codi)?a.codi.localeCompare(b.codi):-1);

        /*if(resolucionsOld) {
          console.log("resolucions old", JSON.parse(JSON.stringify(resolucionsOld)));
        }*/
        for(let estudiEnCurs of estudisEnCurs||[]){
          const estudi:ItemConvalidacio = await ConvalidacioService.mapToItemConvalidacio(estudiEnCurs,true);

          let estat = EstatResolucioConvalidacio.PENDENT;
          let qualificacio = "C-5";

          estudi.selected = false;
          if(convalidacions.find(c=>c.id===estudi.id)){
            estat = EstatResolucioConvalidacio.PREAPROVAT;
            estudi.selected = true;
          }

          //Afegim un asterisc al nom si és una convalidació
          if(convalidacions.find(c=>c.id===estudi.id)){
            estudi.nom += " (**)";
          }

          const resolucio:ResolucioConvalidacio = {
            estat: estat,
            qualificacio: qualificacio,
            estudi: estudi,
            observacions: ""
          }
          this.solicitud.resolucions.push(resolucio)
        }
      })
    },
    mapEstatResolucioToLabel(estat:EstatResolucioConvalidacio):string{
      if(estat===EstatResolucioConvalidacio.APROVAT){
        return "Convalidació aprovada per l'administració"
      } else if(estat===EstatResolucioConvalidacio.DENEGAT){
        return "Convalidació denegada per l'administració"
      } else if(estat===EstatResolucioConvalidacio.PENDENT){
        return "Convalidació pendent de resolució"
      } else if(estat===EstatResolucioConvalidacio.PREAPROVAT){
        return "Convalidació pre-aprovada. Aquesta convalidació serà aprovada una vegada verificats els estudis anteriors."
      }
      return "Sense estat"
    },
    uploadfile: function(response:any){
      if(!this.solicitud.files){
        this.solicitud.files = [];
      }
      this.solicitud.files?.push(response.xhr.responseText)
    },
    save: async function(){

      if(!this.solicitud.nomAlumneManual){
        this.msgstatus = "El nom de l'alumne és obligatori";
        return;
      }

      if(!this.solicitud.cognomsAlumneManual){
        this.msgstatus = "El camp 'cognoms' és obligatori";
        return;
      }

      if( (!this.solicitud.estudisOrigen || this.solicitud.estudisOrigen.length === 0) && !this.solicitud.estudisOrigenManual){
        this.msgstatus = "Ha de seleccionar com a mínim un estudi cursat anteriorment";
        return;
      }

      if(!this.solicitud.estudisEnCurs){
        this.msgstatus = "Ha de seleccionar un estudi que estigui cursant actualment al centre";
        return;
      }

      if(!this.solicitud.resolucions || this.solicitud.resolucions.length === 0){
        this.msgstatus = "Ha de seleccionar com a mínim una convalidació del llistat";
        return;
      }
      this.msgstatus = '';

      const dialog = await this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      const solicitud = Object.assign({},this.solicitud);
      //Agafem només els estudis orígen seleccionats
      if(solicitud.estudisOrigen) {
        solicitud.estudisOrigen = solicitud.estudisOrigen.map(est => {
          est.composa = est.composa?.filter(estfill => estfill.selected)
          return est
        })
      } else {
        solicitud.estudisOrigen = [];
      }
      //Agafem només les resolucions que estiguin seleccionades
      solicitud.resolucions = solicitud.resolucions.filter(r=>r.estudi.selected);
      await ConvalidacioService.saveSolicitudPublic(solicitud);
      await dialog.hide();

      //Redirect
      this.$q.dialog({
        title: 'Sol·licitud enregistrada correctament',
        message: "La seva sol·licitud s'ha enregistrat correctament. Rebrà notícies en breu per part de l'administració",
        ok: "D'acord",
        persistent: true
      }).onOk(async () => {
          window.location.href='http://iesmanacor.cat'
      })
    }
  }
})
</script>

<style scoped>
.background{
  background: #fafafa;
  box-shadow: 0px 0px 10px 10px #eeeeee;
}
</style>
