<template>
  <q-page class="flex column" padding>
    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn  color="primary" label="Scripts departaments" icon="javascript" :to="'/apps/web/scripts'"/>
      </q-btn-group>
    </div>
      <div class="row">
        <div class="col-12">
          <q-table
            :table-style="{ width: '100%' }"
            :dense="$q.screen.lt.lg"
            :grid="$q.screen.lt.sm"
            title="Professors"
            :rows="usuaris"
            :columns="columnes"
            row-key="idusuari"
            :filter="filter"
          >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Cerca">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-foto="props">
              <q-td :props="props">
                <q-img
                  :src="'https://www.iesmanacor.cat/wp-content/uploads/FOTOS/'+props.value"
                  style="width: 50px"
                  class="q-ml-lg"
                >
                  <template v-slot:error>
                    <div style="width: 50px; height: 50px;" class="absolute-full flex flex-center bg-negative text-white">
                      Error
                    </div>
                  </template>
                </q-img>
              </q-td>
            </template>

            <template v-slot:body-cell-accions="props">
              <q-td :props="props">
                <div>
                  <q-btn-group push>
                    <q-btn icon="edit" color="primary" dense :to="'/apps/web/usuari/'+props.value">
                      <q-tooltip>
                        Editar
                      </q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {UsuariWebIesManacorService} from "../../../service/UsuariWebIesManacorService";
import {QTableColumn} from "quasar";
import {UsuariWebIesManacor} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";

export default defineComponent({
  name: 'UsuariList',
  data() {
    return {
      columnes: [] as QTableColumn[],
      usuaris: [] as UsuariWebIesManacor[],
      filter: '',
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      this.columnes = [
        {
          name: 'nom',
          required: true,
          label: 'Nom',
          align: 'left',
          field: row => (row.professor && row.professor.nom)?row.professor.nom:'',
          sortable: true
        },
        {
          name: 'cognom1',
          required: true,
          label: 'Cognom 1',
          align: 'left',
          field: row => (row.professor && row.professor.cognom1)?row.professor.cognom1:'',
          sortable: true
        },
        {
          name: 'cognom2',
          required: true,
          label: 'Cognom 2',
          align: 'left',
          field: row => (row.professor && row.professor.cognom2)?row.professor.cognom2:'',
          sortable: true
        },
        {
          name: 'email',
          required: true,
          label: 'Correu electrònic',
          align: 'left',
          field: row => (row.professor && row.professor.email)?row.professor.email:'',
          sortable: true
        },
        {
          name: 'foto',
          required: true,
          label: 'Foto',
          align: 'left',
          field: row => row.foto,
          sortable: true
        },
        {
          name: 'carrec1',
          required: true,
          label: 'Càrrec 1',
          align: 'left',
          field: row => row.carrec1,
          sortable: true
        },
        {
          name: 'carrec2',
          required: true,
          label: 'Càrrec 2',
          align: 'left',
          field: row => row.carrec2,
          sortable: true
        },
        {
          name: 'carrec3',
          required: true,
          label: 'Càrrec 3',
          align: 'left',
          field: row => row.carrec3,
          sortable: true
        },
        {
          name: 'departament',
          required: true,
          label: 'Departament',
          align: 'left',
          field: row => (row.departament && row.departament.nom)?row.departament.nom:'',
          sortable: true
        },
        {
          name: 'horariatenciopares',
          required: true,
          label: 'Horari Atenció Pares',
          align: 'left',
          field: row => (row.horariAtencioPares)?row.horariAtencioPares:'',
          sortable: true
        },
        {
          name: 'substitut',
          required: true,
          label: 'Substitut',
          align: 'left',
          field: row => (row.substitut)?row.substitut.professor.nomComplet:'',
          sortable: true
        },
        {
          name: 'accions',
          required: true,
          label: 'Accions',
          align: 'center',
          field: row => row.id,
          sortable: true
        }
      ]

      const usuaris = await UsuariWebIesManacorService.findUsuaris();
      this.usuaris = await Promise.all(usuaris);
    }
  },
})
</script>
