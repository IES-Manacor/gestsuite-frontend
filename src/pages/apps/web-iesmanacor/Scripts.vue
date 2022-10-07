<template>
  <q-page class="flex column" padding>
    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn  color="primary" label="Scripts departaments" icon="add" :to="'/apps/web/scripts'"/>
      </q-btn-group>
    </div>
      <div class="row">
        <div class="col-12">
          <q-list bordered separator>

            <q-item v-for="departament in departaments">
              <q-item-section>
                <q-item><strong>{{departament.nom}}</strong></q-item>
                <q-item>&lt;script type="text/javascript" crossorigin="anonymous" src="{{urlServer}}/api/webiesmanacor/public/loadDepartament/{{departament.id}}/script.js"&gt;&lt;script&gt;</q-item>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {UsuariWebIesManacorService} from "../../../service/UsuariWebIesManacorService";
import {QTableColumn} from "quasar";
import {
  UsuariWebIesManacor
} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";
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

    }
  },
})
</script>
