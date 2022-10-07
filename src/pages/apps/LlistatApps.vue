<template>
  <q-page class="flex flex-center">
    <q-list bordered class="rounded-borders">
      <q-item v-for="app in llistatApps" clickable v-ripple>
        <q-item-section>
          <q-btn color="primary" :label="app.nom" :icon="app.icon" :to="app.url" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageCalendari',
  data() {
    return {
      llistatApps: [],
      enableGrupsCooperatius: false,
      enableConvalidacions: false,
      enableWebIESManacor: false
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      this.enableGrupsCooperatius = (process.env.APP_ENABLE_GRUPSCOOPERATIUS==='true');
      this.enableConvalidacions=(process.env.APP_ENABLE_CONVALIDACIONS==='true');
      this.enableWebIESManacor=(process.env.APP_ENABLE_WEBIESMANACOR==='true');

      if(this.enableGrupsCooperatius) {
        this.llistatApps.push({
          icon: 'group',
          nom: 'Grups Cooperatius',
          url: '/apps/grupscooperatius'
        });
      }

      if(this.enableConvalidacions) {
        this.llistatApps.push({
          icon: 'checklist',
          nom: 'Convalidacions',
          url: '/apps/convalidacions/solicituds'
        });
      }

      if(this.enableWebIESManacor) {
        this.llistatApps.push({
          icon: 'public',
          nom: 'Web',
          url: '/apps/web/usuaris'
        });
      }
    }
  }
})
</script>
