<template>
  <q-page class="flex column q-gutter-lg" padding>

    <p class="text-h3">{{(usuari && usuari.professor)?usuari.professor.nomComplet:""}}</p>

    <div class="flex">
      <q-input v-model="usuari.foto" label="Foto" class="col q-mr-lg" />
      <div class="col">
        <q-img
          :src="'https://www.iesmanacor.cat/wp-content/uploads/FOTOS/'+usuari.foto"
          style="height: 140px; max-width: 150px"
          class="q-ml-lg"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Error carregant la imatge
            </div>
          </template>
        </q-img>
      </div>
    </div>
    <q-input v-model="usuari.carrec1" label="Càrrec 1" />
    <q-input v-model="usuari.carrec2" label="Càrrec 2" />
    <q-input v-model="usuari.carrec3" label="Càrrec 3" />

    <q-select
      v-model="usuari.substitut"
      :options="usuaris"
      label="Usuari substitut"
      class="q-mb-lg"
    >
      <template v-if="usuari.substitut" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="usuari.substitut = null" class="cursor-pointer" />
      </template>
    </q-select>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  UsuariWebIesManacor
} from "src/model/apps/webiesmanacor/UsuariWebIesManacor";
import {UsuariWebIesManacorService} from "src/service/UsuariWebIesManacorService";


export default defineComponent({
  name: 'UsuariForm',
  data() {
    return {
      usuari: {} as UsuariWebIesManacor,
      usuaris: [] as UsuariWebIesManacor[]
    }
  },
  async created() {
    await this.get();
  },
  methods: {
    get: async function () {
      /*const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      });*/

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        console.log(id)
        const usuari:UsuariWebIesManacor = await UsuariWebIesManacorService.getById(parseInt(id));

        this.usuari = usuari;

        const usuaris = await UsuariWebIesManacorService.findUsuaris();
        this.usuaris = await Promise.all(usuaris);

        if(this.usuari.substitut){
          this.usuari.substitut = this.usuaris.find(u=>u.id===this.usuari.substitut?.id)
        }
      }


      //dialog.hide();
    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      await UsuariWebIesManacorService.save(this.usuari)
      dialog.hide();

      //Redirect
      await this.$router.push('/apps/web/usuaris');
    }
  }
})
</script>
