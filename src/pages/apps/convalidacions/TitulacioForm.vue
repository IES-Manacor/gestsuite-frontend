<template>
  <q-page class="flex column" padding>
    <div>
      <ConvalidacioListMenu></ConvalidacioListMenu>
    </div>
    <p class="text-h3">{{titulacio.codi || 'Sense Codi'}} - {{titulacio.nom || 'Sense Nom'}}</p>

    <q-input v-model="titulacio.codi" label="Codi" @update:model-value="checkCodi()" />
    <q-input v-model="titulacio.nom" label="Nom" @update:model-value="checkNom()" />
    <q-input v-model="titulacio.nomOriginal" label="Nom original" @update:model-value="checkNom()" />
    <q-checkbox v-model="titulacio.impartitAlCentre" label="Els estudis s'imparteixen al centre?" />

    <q-select
      v-model="titulacio.categoria"
      :options="categories"
      label="Categoria titulació"
      class="q-mb-lg"
    />

    <p class="text-h5">Composició del títol depenent d'altres ítems</p>

    <div>
      <q-btn color="primary" label="Nou ítem del títol" icon="edit" @click="nouItemConvalidacio" class="q-mb-lg q-mt-lg"/>
    </div>

    <q-list bordered class="rounded-borders">

      <q-item-label header v-if="titulacio && titulacio.composa && titulacio.composa.length > 0">Composició del títol</q-item-label>

      <template v-for="(item,idx) in titulacio.composa">
        <q-item  clickable dense class="q-mb-md">
          <q-item-section top class="col-10 q-ma-none flex row">
            <q-select
              v-model="titulacio.composa[idx]"
              :options="itemsFiltered"
              use-input
              @filter="itemsFilterFn"
              label="Ítem"
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
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8">
              <q-btn size="12px" flat dense round icon="delete" @click="deleteItemConvalidacio(item)" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
      </template>
    </q-list>

    <q-banner v-if="msgstatus" inline-actions class="text-white bg-red q-my-md">
      {{msgstatus}}
    </q-banner>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {ItemConvalidacio} from "src/model/apps/convalidacions/ItemConvalidacio";
import {CategoriaConvalidacio} from "src/model/apps/convalidacions/CategoriaConvalidacio";
import {ConvalidacioService} from "src/service/ConvalidacioService";
import ConvalidacioListMenu from 'components/ConvalidacioList_Menu.vue';


export default defineComponent({
  name: 'TitulacioForm',
  data() {
    return {
      titulacio: {
        impartitAlCentre: false,
        composa: [] as ItemConvalidacio[]
      } as ItemConvalidacio,
      categories: [] as CategoriaConvalidacio[],
      items: [] as ItemConvalidacio[],
      itemsFiltered: [] as ItemConvalidacio[],
      itemsSelected: [] as ItemConvalidacio[],
      msgstatus: '',
    }
  },
  components: { ConvalidacioListMenu },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      const dialog = await this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      const categories:CategoriaConvalidacio[] = await ConvalidacioService.getCategories();
      this.categories = categories.map((categoria:CategoriaConvalidacio)=>{
        categoria.label = categoria.nom;
        categoria.value = categoria.id.toString();
        return categoria;
      });

      const items:ItemConvalidacio[] = await ConvalidacioService.getItems();
      this.items = items

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        console.log(id,this.$route.params.id)
        const titulacio:ItemConvalidacio = await ConvalidacioService.getTitulacioById(parseInt(id));
        titulacio.composa?.sort((a, b) => (a.codi)?a.codi.localeCompare(b.codi):-1);

        this.titulacio = titulacio;
      }

      await dialog.hide();
    },
    nouItemConvalidacio: function(){
      console.log("Entra nou valor")
      const itemConvalidacio:ItemConvalidacio = this.items[0];
      this.titulacio.composa?.push(itemConvalidacio)
    },
    deleteItemConvalidacio: function(item:ItemConvalidacio){
      this.titulacio.composa = this.titulacio.composa?.filter((it:ItemConvalidacio)=>it.id!==item.id);
    },
    itemsFilterFn (val:string, update:Function) {
      if (val === '') {
        update(() => {
          this.itemsFiltered = this.items;
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.itemsFiltered = this.items.filter(i=>i.label!.toLowerCase().indexOf(needle) > -1 || false);
      })
    },
    checkNom: async function(){
      console.log("Entra check nom")
      const itemNom:ItemConvalidacio|null = await ConvalidacioService.getTitulacioByNom(this.titulacio.nom);
      if(itemNom!==null){
        this.$q.dialog({
          title: 'Alerta!',
          message: 'Ja existeix una titulació amb aquest nom',
          ok: "D'acord",
          persistent: true
        })
      }
    },
    checkCodi: async function(){
      console.log("Entra check codi")
      const itemCodi:ItemConvalidacio|null = await ConvalidacioService.getTitulacioByCodi(this.titulacio.codi);
      if(itemCodi!==null){
        this.$q.dialog({
          title: 'Alerta!',
          message: 'Ja existeix una titulació amb aquest codi',
          ok: "D'acord",
          persistent: true
        })
      }
    },
    save: async function(){
      if(!this.titulacio.categoria){
        this.msgstatus = "Falta inserir la categoria de la titulació";
        return;
      }
      const itemNom:ItemConvalidacio|null = await ConvalidacioService.getTitulacioByNom(this.titulacio.nom);
      const itemCodi:ItemConvalidacio|null = await ConvalidacioService.getTitulacioByCodi(this.titulacio.codi);
      console.log("itemNom i itemCodi",itemNom,itemCodi)
      if(itemNom!==null || itemCodi!==null){
        this.$q.dialog({
          title: 'Confirmar acció',
          message: 'Ja existeix una titulació amb aquest nom o codi, vol continuar?',
          ok: "D'acord",
          cancel: "Cancel·la",
          persistent: true
        }).onOk(async () => {
          const dialog = await this.$q.dialog({
            message: 'Carregant...',
            progress: true, // we enable default settings
            persistent: true, // we want the user to not be able to close it
            ok: false // we want the user to not be able to close it
          })

          await ConvalidacioService.saveTitulacio(this.titulacio);
          await dialog.hide();

          //Redirect
          await this.$router.push('/apps/convalidacions/titulacions');
        })
      } else {
        const dialog = await this.$q.dialog({
          message: 'Carregant...',
          progress: true, // we enable default settings
          persistent: true, // we want the user to not be able to close it
          ok: false // we want the user to not be able to close it
        })

        await ConvalidacioService.saveTitulacio(this.titulacio);
        await dialog.hide();

        //Redirect
        await this.$router.push('/apps/convalidacions/titulacions');
      }
    }
  }
})
</script>
