<template>
  <q-page class="flex column" padding>

    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn color="primary" label="Nova mescla" icon="add" :to="'/apps/grupscooperatius/mescla'"/>
        <q-btn v-if="selected.length > 0" color="primary" label="Editar" icon="edit" :to="'/apps/grupscooperatius/mescla/'+selected[0].id"/>
        <q-btn v-else disable color="primary" label="Editar" icon="edit" />
      </q-btn-group>

      <q-btn-group push class="q-mb-lg">
        <q-btn color="primary" label="Gestionar ítems" icon="list" :to="'/apps/grupscooperatius/items'"/>
      </q-btn-group>

    </div>

    <q-table
      title="Grups cooperatius"
      :rows="grupsCooperatius"
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
    </q-table>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {QTableColumn} from "quasar";
import {GrupCooperatiuService} from "src/service/GrupCooperatiuService";
import {GrupCooperatiu} from "src/model/apps/grupsCooperatius/GrupCooperatiu";

export default defineComponent({
  name: 'PageGrupCorreu',
  data() {
    return {
      grupsCooperatius: [] as GrupCooperatiu[],
      columnes: []  as QTableColumn[],
      selected: []  as GrupCooperatiu[],
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
          label: 'Nom grup cooperatiu',
          align: 'left',
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'numgrups',
          required: true,
          label: "Nombre d'agrupaments",
          align: 'left',
          field: row => row.agrupaments.length,
          format: val => `${val}`,
          sortable: true
        }
      ]

      this.grupsCooperatius = await GrupCooperatiuService.getGrupsCooperatius()
    }
  }
})
</script>
