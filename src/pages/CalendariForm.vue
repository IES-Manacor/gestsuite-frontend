<template>
  <q-page class="flex column q-gutter-lg" padding>
    <p class="text-h3">{{calendari.nom}}</p>
    <p class="text-h6">{{calendari.email}}</p>

    <q-select
      filled
      :model-value="selected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @input-value="setModel"
      label="Afegir usuaris de GSuite"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sense resultats
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      filled
      :model-value="grupSelected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="grupOptions"
      @filter="grupFilterFn"
      @input-value="setGrupModel"
      label="Afegir grups de GSuite"
      class="q-mb-lg"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sense resultats
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select v-model="calendari.tipus" :options="optionsGrupCorreuTipus" label="Tipus de grup" />

    <q-list bordered class="rounded-borders">

      <q-separator spaced v-if="grupMembers.length > 0" />
      <q-item-label header v-if="grupMembers.length > 0">Grups de correu</q-item-label>

      <q-item v-for="grup in grupMembers" clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm">{{grup.nom}}</q-item-label>
          <q-item-label class="q-mt-sm">{{grup.email}}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="delete" @click="deleteGrupMember(grup)" />
          </div>
        </q-item-section>
      </q-item>

      <q-separator spaced v-if="members.length > 0" />
      <q-item-label header v-if="members.length > 0">Usuaris</q-item-label>

      <q-item v-for="user in members" clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm">{{user.nomComplet}}</q-item-label>
          <q-item-label class="q-mt-sm">{{user.email}}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="delete" @click="deleteMember(user)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Calendari} from "src/model/google/Calendari";
import {CalendariService} from "src/service/CalendariService";
import {UsuariService} from "src/service/UsuariService";
import {GrupCorreuService} from "src/service/GrupCorreuService";
import {GrupCorreu} from "src/model/google/GrupCorreu";
import {Usuari} from "src/model/Usuari";
import {QTableColumn} from "quasar";

export default defineComponent({
  name: 'PageCalendariForm',
  data() {
    return {
      calendari: {} as Calendari,
      members: [] as Usuari[],
      users: [] as Usuari[],
      grupMembers: [] as GrupCorreu[],
      grups: [] as GrupCorreu[],
      selected:[],
      grupSelected: [] as GrupCorreu[],
      options: [] as Usuari[],
      grupOptions: [] as GrupCorreu[],
      optionsGrupCorreuTipus: [],
      filterUsuaris: '',
      filterGrups: '',
      selectedUsuaris: [],
      selectedGrups: [],
      columnesGrup: [] as QTableColumn[],
      columnesUsuari: [] as QTableColumn[],
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      this.columnesGrup = [
        {
          name: 'email',
          required: true,
          label: 'Correu electrònic',
          align: 'left',
          field: row => row.gsuiteEmail,
          sortable: true
        },
        {
          name: 'gsuitenom',
          required: true,
          label: 'Nom GSuite',
          align: 'left',
          field: row => row.gsuiteNom,
          format: val => `${val}`,
          sortable: true
        }
      ]

      this.columnesUsuari = [
        {
          name: 'nom',
          required: true,
          label: 'Nom',
          align: 'left',
          field: row => (row.gestibNom)?row.gestibNom:row.gsuiteGivenName,
          sortable: true
        },
        {
          name: 'cognom1',
          required: true,
          label: 'Cognom 1',
          align: 'left',
          field: row => (row.gestibCognom1)?row.gestibCognom1:row.gsuiteFamilyName,
          sortable: true
        },
        {
          name: 'cognom2',
          required: true,
          label: 'Cognom 2',
          align: 'left',
          field: row => (row.gestibCognom2)?row.gestibCognom2:'',
          sortable: true
        },
        {
          name: 'email',
          required: true,
          label: 'Correu electrònic',
          align: 'left',
          field: row => row.gsuiteEmail,
          sortable: true
        },
        {
          name: 'gsuitenom',
          required: true,
          label: 'Nom GSuite',
          align: 'left',
          field: row => row.gsuiteFullName,
          format: val => `${val}`,
          sortable: true
        }
      ]

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        this.calendari = await CalendariService.getCalendariByEmail(id);

      }

      this.users = await UsuariService.findUsuarisActius();

      this.grups = await GrupCorreuService.findAll();


      this.options = this.users;

      this.grupOptions = this.grups;

      /*if(id){
        this.grup.grupCorreuTipus = this.optionsGrupCorreuTipus.find(tipus=>tipus==this.grup.grupCorreuTipus);
        this.grup.grups = this.grup.grups.map(g=>{
          return this.grupClasseOptions.find(gco=>gco.value===g.gestibIdentificador)
        })
      }*/

      dialog.hide();
    },
    deleteMember: function(member:Usuari){
      this.members = this.members.filter(m=>{
        return m !== member
      })
    },
    deleteGrupMember: function(member:GrupCorreu){
      this.grupMembers = this.grupMembers.filter(m=>{
        return m !== member
      })
    },
    setModel (val:string  ) {
      let usuari = this.users.find(user=> {
        return user.label === val
      })
      if(usuari){
        this.members.push(usuari)
        this.selected = [];
      }
    },
    filterFn (val:string, update:any) {
      if (val === '') {
        update(() => {
          this.options = this.users
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.users.filter(v => {
          let nomComplet = false;
          let email = false;

          if(v.nomComplet) {
            nomComplet = v.nomComplet.toLowerCase().indexOf(needle) > -1
          }

          if(v.email) {
            email = v.email.toLowerCase().indexOf(needle) > -1
          }
          return nomComplet || email;
        })
      })
    },
    setGrupModel (val:string) {
      let grup = this.grups.find(grup=> {
        return grup.label === val
      })
      if(grup){
        this.grupMembers.push(grup)
        this.grupSelected = [];
      }
    },
    grupFilterFn (val:string, update:any) {
      if (val === '') {
        update(() => {
          this.grupOptions = this.grups
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.grupOptions = this.grups.filter(v => {
          let nom = false;
          let email = false;

          if(v.nom) {
            nom = v.nom.toLowerCase().indexOf(needle) > -1
          }

          if(v.email) {
            email = v.email.toLowerCase().indexOf(needle) > -1
          }
          return nom || email;
        })
      })
    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      //this.calendari.usuaris = this.members;
      //this.grup.grupCorreus = this.grupMembers;

      await this.$axios.post(process.env.API + '/api/core/grupcorreu/desar',this.calendari);
      dialog.hide();
      //Redirect
      this.$router.push('/calendari/list');
    }
  }
})
</script>
