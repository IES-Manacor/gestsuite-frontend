<template>
  <q-page class="flex column q-gutter-lg" padding>
    <p class="text-h3">Departament: {{departament.nom}}</p>

    <q-select v-model="departament.capDepartament" :options="professors" label="Cap de departament" />


    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Grup} from "src/model/gestib/Grup";
import {Curs} from "src/model/gestib/Curs";
import {CursService} from "src/service/CursService";
import {GrupService} from "src/service/GrupService";
import {QTableColumn} from "quasar";
import {Usuari} from "src/model/Usuari";
import {Departament} from "src/model/gestib/Departament";
import {UsuariService} from "src/service/UsuariService";
import {DepartamentService} from "src/service/DepartamentService";

export default defineComponent({
  name: 'PageGrupCorreuForm',
  data() {
    return {
      departament: {} as Departament,
      professors: [] as Usuari[]
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        this.departament = await DepartamentService.getDepartamentById(id);
      }

      const usuarisActius:Usuari[] = await UsuariService.findUsuarisActius();
      this.professors = usuarisActius.filter(u=>u.esProfessor);


    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })


      await this.$axios.post(process.env.API + '/api/core/departament/desa',this.departament);
      dialog.hide();
      //Redirect
      this.$router.push('/departament/list');
    }
  }
})
</script>
