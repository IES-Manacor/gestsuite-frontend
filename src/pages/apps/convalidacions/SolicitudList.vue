<template>
  <q-page class="flex column" padding>
    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn color="primary" label="Nova sol·licitud" icon="add" :to="'/apps/convalidacions/solicitud'"/>
      </q-btn-group>

      <ConvalidacioListMenu></ConvalidacioListMenu>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="pendent_resolucio" label="Pendent de resolució"/>
      <q-tab name="pendent_signatura" label="Pendent de signatura"/>
      <q-tab name="resolts" label="Resolts"/>
      <q-tab name="cancelats" label="Cancel·lats"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="pendent_resolucio">
        <q-table
          title="Sol·licituds pendents de resolució"
          :rows="solicitudsPendentResolucio"
          :columns="columnesPendentResolucio"
          :filter="filterPendentResolucio"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterPendentResolucio" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="edit" color="primary" :to="'/apps/convalidacions/solicitud/'+props.value">
                    <q-tooltip>
                      Edita
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="primary" @click="esborrarSolicitud(props.value)">
                    <q-tooltip>
                      Esborra
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="pendent_signatura">
        <q-btn class="q-ma-md" label="Signar resolucions" color="primary" @click="confirmSignatura = true"/>
        <q-table
          title="Sol·licituds pendent de signatura"
          :rows="solicitudsPendentSignatura"
          :columns="columnesPendentSignatura"
          :filter="filterPendentSignatura"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedPendentSignatura"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterPendentSignatura" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="edit" color="primary" :to="'/apps/convalidacions/solicitud/'+props.value">
                    <q-tooltip>
                      Edita
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="primary" @click="esborrarSolicitud(props.value)">
                    <q-tooltip>
                      Esborra
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="resolts">
        <q-btn
          color="primary"
          icon-right="archive"
          label="Exportar dades a csv"
          no-caps
          class="q-my-lg"
          @click="exportTable"
        />
        <q-table
          title="Sol·licituds resoltes"
          :rows="solicitudsResoltes"
          :columns="columnesResoltes"
          :filter="filterResoltes"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterResoltes" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="description" color="primary" :href="props.value" target="_blank">
                    <q-tooltip>
                      Document signat
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="cancelats">
        <q-table
          title="Sol·licituds"
          :rows="solicitudsCancelades"
          :columns="columnesCancelades"
          :filter="filterCancelades"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterCancelades" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="edit" color="primary" :to="'/apps/convalidacions/solicitud/'+props.value">
                    <q-tooltip>
                      Edita
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="primary" @click="esborrarSolicitud(props.value)">
                    <q-tooltip>
                      Esborra
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="confirmSignatura" persistent>
      <q-card>
        <q-card-section class="flex column">
          <div class="row items-center">
            <q-avatar icon="fingerprint" color="primary" text-color="white"/>
            <span class="q-ml-sm">Està segur que vol signar {{ selectedPendentSignatura.length }} resolucions?</span>
          </div>
            <q-file v-model="fileSignature" label="Fitxer signatura" />
            <q-input v-model="passwordSignature" type="password" placeholder="Contrasenya signatura" hint="La contrasenya NO es desa en cap cas."/>
            <span class="q-ml-sm">Aquesta acció no es pot desfer.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup/>
          <q-btn label="Signar" color="primary" @click="signaSolicituds" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {ConvalidacioService} from 'src/service/ConvalidacioService';
import {QTableColumn,exportFile, useQuasar } from "quasar";
import ConvalidacioListMenu from 'components/ConvalidacioList_Menu.vue';
import {EstatSolicitudConvalidacio, SolicitudConvalidacio} from "src/model/apps/convalidacions/SolicitudConvalidacio";
import {PDFService} from "src/service/PDFService";
import {UsuariService} from "src/service/UsuariService";


export default defineComponent({
  name: 'SolicitudList',
  data() {
    return {
      solicitudsPendentResolucio: [] as SolicitudConvalidacio[],
      solicitudsPendentSignatura: [] as SolicitudConvalidacio[],
      solicitudsResoltes: [] as SolicitudConvalidacio[],
      solicitudsCancelades: [] as SolicitudConvalidacio[],
      columnesPendentSignatura: [] as QTableColumn[],
      columnesPendentResolucio: [] as QTableColumn[],
      columnesResoltes: [] as QTableColumn[],
      columnesCancelades: [] as QTableColumn[],
      columnesStandBy: [] as QTableColumn[],
      selectedPendentSignatura: [],
      filterPendentResolucio: '',
      filterPendentSignatura: '',
      filterResoltes: '',
      filterCancelades: '',
      tab: ref('pendent_resolucio'),
      confirmSignatura: false,
      fileSignature: null,
      passwordSignature: ''
    }
  },
  components: {ConvalidacioListMenu},
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      const columnes:QTableColumn[] = [
        {
          name: 'alumne',
          required: true,
          label: 'Alumne',
          align: 'left',
          field: row => (row.alumne)?row.alumne.cognom1 + " " + row.alumne.cognom2 + ", " + row.alumne.nom:row.cognomsAlumneManual + ", " +row.nomAlumneManual,
          sortable: true
        },
        {
          name: 'estat',
          required: true,
          label: 'Estat',
          align: 'left',
          field: row => {
            if (row.estat === EstatSolicitudConvalidacio.RESOLT) {
              return "Convalidació resolta"
            } else if (row.estat === EstatSolicitudConvalidacio.PENDENT_SIGNATURA) {
              return "Convalidació pendent de signatura"
            } else if (row.estat === EstatSolicitudConvalidacio.PENDENT_RESOLUCIO) {
              return "Convalidació pendent de resolució per part de l'administració"
            } else if (row.estat === EstatSolicitudConvalidacio.CANCELAT){
              return "Convalidació cancel·lada per part de l'administració"
            }
          },
          sortable: true
        }
      ]

      const columnaAccions:QTableColumn = {
        name: 'accions',
        required: true,
        label: 'Accions',
        align: 'center',
        field: row => row.id,
        sortable: true
      }

      const columnesSolicitudsResoltes:QTableColumn[] = [
        {
          name: 'alumne',
          required: true,
          label: 'Alumne',
          align: 'left',
          field: row => (row.alumne)?row.alumne.cognom1 + " " + row.alumne.cognom2 + ", " + row.alumne.nom:row.cognomsAlumneManual + ", " +row.nomAlumneManual,
          sortable: true
        },
        {
          name: 'estudis',
          required: true,
          label: 'Estudis',
          align: 'left',
          field: row => row.estudisEnCurs.nom,
          sortable: true
        },
        {
          name: 'convalidacions_aprovades',
          required: true,
          label: 'Convalidacions aprovades',
          align: 'left',
          field: row => {
            const resolucions = row.resolucions.filter((r:any)=>r.estat==='APROVAT').map((r:any)=>{
              const codi = r.estudi.codi;
              const nomEstudi = r.estudi.nom;
              const qualificacio = r.qualificacio;
              let result = "";
              if(codi){
                result += codi+" - ";
              }
              result += nomEstudi;
              if(qualificacio){
                result += " ("+qualificacio+")"
              }
              return result;
            })
            return resolucions.join(", ")
          },
          sortable: true,
          style: 'overflow: hidden; white-space:pre-wrap; word-wrap:break-word; text-overflow: ellipsis;'
        },
        {
          name: 'convalidacions_denegades',
          required: true,
          label: 'Convalidacions denegades',
          align: 'left',
          field: row => {
            const resolucions = row.resolucions.filter((r:any)=>r.estat==='DENEGAT').map((r:any)=>{
              const codi = r.estudi.codi;
              const nomEstudi = r.estudi.nom;
              let result = "";
              if(codi){
                result += codi+" - ";
              }
              result += nomEstudi;

              return result;
            })
            return resolucions.join(", ")
          },
          sortable: true,
          style: 'overflow: hidden; white-space:pre-wrap; word-wrap:break-word; text-overflow: ellipsis;'
        },
        {
          name: 'accions',
          required: true,
          label: 'Accions',
          align: 'center',
          field: row => row.fitxerResolucio.url,
          sortable: true
        }
      ]

      this.columnesPendentResolucio = [...columnes];
      this.columnesPendentResolucio.push(columnaAccions)
      this.columnesPendentSignatura = [...columnes];
      this.columnesPendentSignatura.push(columnaAccions)
      this.columnesResoltes = [...columnesSolicitudsResoltes];
      this.columnesStandBy = [...columnes];
      this.columnesStandBy.push(columnaAccions)
      this.columnesCancelades = [...columnes];
      this.columnesCancelades.push(columnaAccions)

      const solicitudsPromise: Promise<Array<SolicitudConvalidacio>> = ConvalidacioService.getSolicituds();
      const solicituds:Array<SolicitudConvalidacio> = await Promise.all(await solicitudsPromise);

      //console.log("Solicituds",solicituds)
      this.solicitudsPendentResolucio = solicituds.filter(s=>s.estat===EstatSolicitudConvalidacio.PENDENT_RESOLUCIO);
      this.solicitudsPendentSignatura = solicituds.filter(s=>s.estat===EstatSolicitudConvalidacio.PENDENT_SIGNATURA);
      this.solicitudsResoltes = solicituds.filter(s=>s.estat===EstatSolicitudConvalidacio.RESOLT);
      this.solicitudsCancelades = solicituds.filter(s=>s.estat===EstatSolicitudConvalidacio.CANCELAT);
      //console.log(solicituds)
    },
    esborrarSolicitud(id: number) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Vol eliminar aquesta sol·licitud?',
        ok: "D'acord",
        cancel: "Cancel·la",
        persistent: true
      }).onOk(async () => {
        console.log('>>>> OK', id)
        await ConvalidacioService.esborrarSolicitud(id);
        //Refresh data
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      })
    },
    signaSolicituds: async function () {
      const solicituds = this.selectedPendentSignatura;

      for(let solicitud of solicituds){
        await PDFService.generateSolicitud(solicitud,false,this.fileSignature,this.passwordSignature)
      }
      //Redirect
      setTimeout(function () {
        //window.location.reload();
      }, 1000);
    },
     wrapCsvValue: function(val:any, formatFn?:any, row?:any) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    },
    exportTable: function(){
      // naive encoding to csv format
      const content = [this.columnesResoltes.map(col => this.wrapCsvValue(col.label))].concat(
        this.solicitudsResoltes.map( (row:any) => this.columnesResoltes.map(col => (col.name!=='accions')?this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[ col.field === void 0 ? col.name : col.field ],
          col.format,
          row
        ):'').join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  }
})
</script>
