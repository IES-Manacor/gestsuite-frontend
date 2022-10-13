<template>
  <q-page class="flex column" padding>
    <q-table
      title="Calendaris"
      :rows="calendaris"
      :columns="columnes"
      row-key="id"
      selection="single"
      :filter="filter"
      v-model:selected="selected"
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
              <q-btn icon="edit" color="primary" dense :to="'/calendari/'+props.value">
                <q-tooltip>
                  Edita
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
import {ConvalidacioService} from 'src/service/ConvalidacioService';
import {CategoriaConvalidacio} from "src/model/apps/convalidacions/CategoriaConvalidacio";
import {QTableColumn} from "quasar";
import ConvalidacioListMenu from 'components/ConvalidacioList_Menu.vue';
import {Rol} from "src/model/Rol";
import {Calendari} from "src/model/google/Calendari";
import {CalendariService} from "src/service/CalendariService";


export default defineComponent({
  name: 'PageGrupCorreu',
  data() {
    return {
      calendaris: [] as Calendari[],
      columnes: [] as QTableColumn[],
      selected: [],
      filter: '',
      rolsUser: JSON.parse(localStorage.getItem("rol")??"") || [],
      rols: Rol
    }
  },
  components: { ConvalidacioListMenu },
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
          name: 'tipus',
          required: true,
          label: 'Tipus',
          align: 'left',
          field: row => row.tipus,
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

      const calendaris:Array<Calendari>= await CalendariService.getCalendaris();

      this.calendaris = calendaris;
    }
  }
})
</script>
