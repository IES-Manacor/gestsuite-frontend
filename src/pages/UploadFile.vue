<template>
  <q-page class="flex column flex-center" padding>
    <h2>Pujar fitxer Gestib</h2>
    <p>Alerta: el fitxer ha de ser del centre i de l'any acadèmic actual.</p>
    <q-file v-model="file" label="Fitxer" />

    <q-toggle
      v-model="syncProfessors"
      label="Sincronitzar professorat"
    />

    <q-toggle
      v-model="syncAlumnes"
      label="Sincronitzar alumnat"
    />

    <div class="flex q-ma-lg">
      <q-btn @click="upload" color="primary" class="q-ma-md">Puja fitxer XML</q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  data () {
    return {
      file: null,
      syncProfessors: true,
      syncAlumnes: true,
    }
  },
  methods:{

    upload: async function(){
      console.log("Entra a upload",this.file);

      const formData = new FormData();
      formData.append("arxiu", this.file);
      formData.append("syncprofessors", this.syncProfessors);
      formData.append("syncalumnes", this.syncAlumnes);

      const response = await this.$axios.post(
        process.env.API + "/api/core/sync/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );

      const dataResponse = await response.data;

    }
  }
})
</script>
