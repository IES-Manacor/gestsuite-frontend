<template>
  <q-page class="flex column" padding>
    <h3>Eines d'administrador</h3>

    <q-btn @click="backupDatabase" color="primary" class="q-ma-md">Backup Database</q-btn>
    <small class="text-center">Còpia de seguretat de la base de dades. Upload al bucket de Google.</small>

    <q-btn @click="importGSuiteUsers" color="primary" class="q-ma-md">Importar usuaris GSuite</q-btn>
    <small class="text-center">Importar còpia de GSuite a la BBDD</small>

    <q-btn @click="reassignarGrupsGSuiteToBBDD" color="primary" class="q-ma-md">Reassignar grups de GSuite a la BBDD.</q-btn>
    <small class="text-center">No actualitza GSuite, només la BBDD</small>

    <q-btn @click="cancelUpload" color="primary" class="q-ma-md">Cancel·la pujada de l'arxiu de sincronització.</q-btn>
    <small class="text-center">Cancel·lar l'arxiu pujat a GestSuite</small>

    <q-btn @click="simula" color="primary" class="q-ma-md">Simulació</q-btn>
    <small class="text-center">Si hi ha fitxer pujat, comença la simulació. NO desa cap resultat a base de dades ni a GSuite.</small>

    <q-btn @click="sync" color="primary" class="q-ma-md">Sincronitza</q-btn>
    <small class="text-center">Si hi ha fitxer pujat, comença la sincronització. Alerta, dura molt de temps.</small>

    <q-btn @click="syncAlumnes" color="primary" class="q-ma-md">Reassigna grups alumnes</q-btn>
    <small class="text-center">Resincronitza els grups de TOTS els alumnes (Gestib i GSuite)</small>

    <q-btn @click="syncProfessors" color="primary" class="q-ma-md">Reassigna grups professors</q-btn>
    <small class="text-center">Resincronitza els grups de TOTS els professors (Gestib i GSuite)</small>

    <q-btn @click="normalitzarNoms" color="primary" class="q-ma-md">Normalitzar noms</q-btn>
    <small class="text-center">Normalitza els noms amb el format "Nom Cognom1 Cognom2"</small>

    <q-btn @click="provaGmail" color="primary" class="q-ma-md">Prova Gmail</q-btn>
    <small class="text-center">Missatge de prova de Gmail</small>

    <div v-if="result">
      <p v-for="r in result">{{r}}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  data(){
    return {
      result: []
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
    },
    backupDatabase:async function(){
      await this.$axios.post(process.env.API + '/api/core/administrator/backupdatabase');
    },
    reassignarGrupsGSuiteToBBDD: async function(){
      await this.$axios.post(process.env.API + '/api/core/sync/reassignarGrupsCorreuGSuiteToDatabase');
    },
    simula: async function(){
      const resultat = await this.$axios.post(process.env.API + "/api/core/sync/simular");
      this.result = resultat.data;
    },
    sync: async function(){
      await this.$axios.post(process.env.API + "/api/core/sync/sincronitza");
    },
    syncAlumnes: async function(){
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsAlumnes");
    },
    syncProfessors: async function(){
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsProfessors");
    },
    provaGmail: async function(){
      await this.$axios.post(process.env.API + "/api/core/proves/gmail");
    },
    normalitzarNoms: async function(){
      await this.$axios.post(process.env.API + "/api/core/gsuite/normalize-noms");
    },
    importGSuiteUsers: async function(){
      await this.$axios.post(process.env.API + "/api/core/sync/importgsuiteusers");
    },
    cancelUpload: async function(){
      await this.$axios.post(process.env.API + "/api/core/sync/cancelupload");
    }

  }
})
</script>
