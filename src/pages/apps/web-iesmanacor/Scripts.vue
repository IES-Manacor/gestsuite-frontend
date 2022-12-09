<template>
  <q-page class="flex column" padding>
    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn  color="primary" label="Usuaris" icon="people" :to="'/apps/web/usuaris'"/>
      </q-btn-group>
    </div>
      <div class="row">
        <div class="col-12">
          <q-list bordered separator>

            <q-item v-for="departament in departaments">
              <q-item-section>
                <p><strong>{{departament.nom}}</strong></p>
                  <code>&lt;script defer type="text/javascript" crossorigin="anonymous" src="{{urlServer}}/api/webiesmanacor/public/loadDepartament/{{departament.id}}/script.js"&gt;&lt;/script&gt;</code>
              </q-item-section>
              <q-item-section avatar>
                <q-btn color="primary" label="Generar Script" @click="generarScript(departament.id)" />
                <q-btn color="primary" label="Recuperar Backup" @click="recuperarBackupScript(departament.id)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Departament} from "src/model/gestib/Departament";
import {DepartamentService} from "src/service/DepartamentService";

export default defineComponent({
  name: 'UsuariList',
  data() {
    return {
      departaments: [] as Departament[],
      urlServer: process.env.API
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      this.departaments = await DepartamentService.getDepartaments();

    },
    generarScript: async function (id:number) {
      await DepartamentService.generarScriptDepartament(id);
    },
    recuperarBackupScript: async function (id:number) {
      await DepartamentService.recuperarBackupScriptDepartament(id);
    }
  },
})
</script>
