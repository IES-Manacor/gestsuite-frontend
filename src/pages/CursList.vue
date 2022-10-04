<template>
  <q-page class="flex column" padding>

    <q-table
      title="Cursos"
      :rows="cursos"
      :columns="columnes"
      row-key="id"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Cerca">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-accions="props">
        <q-td :props="props">
          <div>
            <q-btn-group push>
              <q-btn icon="edit" color="primary" dense :to="'/curs/'+props.value">
                <q-tooltip>
                  Editar
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </div>
        </q-td>
      </template>

    </q-table>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Curs} from "src/model/gestib/Curs";
import {Grup} from "src/model/gestib/Grup";
import {CursService} from "src/service/CursService";
import {GrupService} from "src/service/GrupService";
import {QTableColumn} from "quasar";

export default defineComponent({
  name: 'PageGrupCorreu',
  data() {
    return {
      cursos: [] as Curs[],
      columnes: [] as QTableColumn[],
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
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'unitatorganitzativa',
          required: true,
          label: 'Unitat Organitzativa',
          align: 'left',
          field: row => row.unitatOrganitzativa,
          sortable: true
        },
        {
          name: 'grups',
          required: true,
          label: 'Grups',
          align: 'left',
          field: row => {
            if(row.grups){
              return row.grups.map((g:Grup)=>g.nom).join(", ")
            }
            return "";
          },
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

      let cursos:Curs[] = await CursService.getCursos();

      for(let curs of cursos){
        let grups:Grup[] = await GrupService.getGrupsByCurs(curs);
        curs.grups = grups;
      }

      this.cursos = cursos;
    }
  }
})
</script>
