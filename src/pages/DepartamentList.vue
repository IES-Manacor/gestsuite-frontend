<template>
  <q-page class="flex column" padding>

    <q-table
      title="Departaments"
      :rows="departaments"
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
              <q-btn icon="edit" color="primary" dense :to="'/departament/'+props.value">
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
import {QTableColumn} from "quasar";
import {Departament} from "src/model/gestib/Departament";
import {DepartamentService} from "src/service/DepartamentService";

export default defineComponent({
  name: 'PageDepartamentList',
  data() {
    return {
      departaments: [] as Departament[],
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
          name: 'capdepartament',
          required: true,
          label: 'Cap de departament',
          align: 'left',
          field: (row:Departament) => {
            if(row.capDepartament){
              return row.capDepartament.nom + " " + row.capDepartament.cognom1 + " " + row.capDepartament.cognom2
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

      let departaments:Departament[] = await DepartamentService.getDepartaments();

      this.departaments = departaments;
    }
  }
})
</script>
