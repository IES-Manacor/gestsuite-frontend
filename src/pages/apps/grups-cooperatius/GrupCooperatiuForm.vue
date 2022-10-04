<template>
  <q-page class="flex column" padding>
    <div>
      <q-btn-group push class="q-mb-lg q-mr-lg">
        <q-btn  color="primary" label="Grups cooperatius" icon="group" :to="'/apps/grupscooperatius'"/>
      </q-btn-group>

      <q-btn-group push class="q-mb-lg">
        <q-btn  color="primary" label="Gestionar ítems" icon="list" :to="'/apps/grupscooperatius/items'"/>
      </q-btn-group>
    </div>

    <h1 class="text-h3">Mescla de grups</h1>

    <p class="text-h3">{{grupCooperatiu.nom}}</p>

    <q-input v-model="grupCooperatiu.nom" label="Nom de la mescla" />
    <q-input v-model="numGrups" label="Número de grups" type="number" min="1" />

    <!-- USUARIS -->
    <p class="text-h5">Selecciona els usuaris de la mescla</p>

    <q-input bottom-slots v-model="userManualSelected" label="Usuari manual" class="q-my-lg">
      <template v-slot:hint>
        Afegir usuari manualment
      </template>

      <template v-slot:append>
        <q-btn round dense flat icon="send" @click="addUserManual" />
      </template>
    </q-input>

    <q-select
      filled
      :model-value="userSelected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="userOptions"
      @filter="userFilterFn"
      @input-value="setUserModel"
      label="Afegir usuaris de GSuite"
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

    <!-- ITEMS -->
    <p class="text-h5">Selecciona els ítems de la mescla</p>
    <p class="text">Només es tindran en compte els ítems en la mescla genètica</p>

    <q-select
      filled
      :model-value="itemSelected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="itemOptions"
      @filter="itemFilterFn"
      @input-value="setItemModel"
      label="Afegir ítems"
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

    <q-list bordered class="rounded-borders">
      <q-item clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm col-8">Les amistats es valoraran un {{percentatgeAmics}}%</q-item-label>
          <q-item-label class="q-mt-sm col-4"><q-input v-model="percentatgeAmics" label="Percentatge amics" type="number" min="0" max="100" /></q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm col-8">Les enemistats es valoraran un {{percentatgeEnemics}}%</q-item-label>
          <q-item-label class="q-mt-sm col-4"><q-input v-model="percentatgeEnemics" label="Percentatge enemics" type="number" min="0" max="100" /></q-item-label>
        </q-item-section>
      </q-item>

      <q-item-label header v-if="grupCooperatiu.itemsGrupCooperatiu && grupCooperatiu.itemsGrupCooperatiu.length > 0">Ítems</q-item-label>

      <q-item v-for="item in grupCooperatiu.itemsGrupCooperatiu" clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm col-8">{{item.item.nom}}</q-item-label>
          <q-item-label class="q-mt-sm col-4"><q-input v-model="item.percentatge" label="Ponderació" type="number" min="0" max="100" /></q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="delete" @click="deleteItem(item)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!--q-list-- bordered class="rounded-borders">

      <q-item-label header v-if="members.length > 0">Usuaris</q-item-label>

      <q-expansion-item v-for="user in members"
                        clickable
                        v-ripple
                        expand-separator
                        default-opened
                        icon="perm_identity"
                        :label="user.nom">
        <q-item-section top class="col-10 gt-sm">
          <q-list bordered class="rounded-borders">

            <q-item-label header v-if="grupCooperatiu.itemsGrupCooperatiu && grupCooperatiu.itemsGrupCooperatiu.length > 0">Ítems</q-item-label>

            <q-item v-for="(item,idx) in grupCooperatiu.itemsGrupCooperatiu" clickable v-ripple>
              <q-item-section top class="col-10 gt-sm">
                <q-item-label class="q-mt-sm col-8">{{item.item.nom}}</q-item-label>
                <q-item-label class="q-mt-sm col-4">
                  <q-select v-model="user.valorsItemMapped[idx]" label="Valor" :options="item.item.valorsMapped" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs q-mb-lg q-mt-md q-mr-md">
            <q-btn size="12px" color="red" label="Esborrar" icon="delete" @click="deleteMember(user)" />
          </div>
        </q-item-section>
      </q-expansion-item>
    </q-list-->

    <div style="width: 100%;">
    <q-table
      class="sticky-nom-table"
      title="Usuaris de la mescla"
      :rows="members"
      :columns="columnes"
      row-key="idmembre"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <!--q-btn size="12px" color="red" label="Esborrar" icon="delete" @click="deleteMember(props.row)" /-->
            <q-btn size="12px" color="red" round icon="delete" @click="deleteMember(props.row)" />
          </q-td>
          <q-td :props="props" key="idmembre">{{props.row.nom}}</q-td>
          <q-td :props="props" key="amics">
            <q-select
              style="width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              filled
              v-model="props.row.amics"
              :options="members.map(m=>m.nom).sort((a,b)=>a.localeCompare(b))"
              multiple
              label="Amistats"
            />
          </q-td>
          <q-td :props="props" key="enemics">
            <q-select
              style="width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              filled
              v-model="props.row.enemics"
              :options="members.map(m=>m.nom).sort((a,b)=>a.localeCompare(b))"
              multiple
              label="Enemistats"
            />
          </q-td>
          <q-td :props="props" key="agrupamentFixe">
            <q-input v-model="props.row.agrupamentFixe" label="Número de grup" hint="Emplenar NOMÉS si es vol fixar el grup" />
          </q-td>
          <q-td v-for="(item,idx) in grupCooperatiu.itemsGrupCooperatiu" :props="props" :key="'item_'+item.item.id+''">
            <q-select v-model="props.row.valorsItemMapped[idx]" label="Valor" :options="item.item.valorsMapped" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </div>


    <!-- MESCLES -->
    <div class="flex">
      <q-btn-group class="q-mb-lg q-mt-lg">
        <q-btn  v-if="members.length > 0" color="primary" label="Mescla aleatòria" icon="edit" @click="mesclaAleatoria" />
        <q-btn-dropdown v-if="members && grupCooperatiu.itemsGrupCooperatiu && members.length > 0 && grupCooperatiu.itemsGrupCooperatiu.length > 0" color="primary" label="Mescla genètica" icon="edit" auto-close>
          <q-list>
            <q-item clickable v-close-popup @click="mesclaGenetica(1000)">
              <q-item-section>
                <q-item-label>Ràpida</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="mesclaGenetica(400000)">
              <q-item-section>
                <q-item-label>Normal</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="mesclaGenetica(1000000)">
              <q-item-section>
                <q-item-label>Acurada</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="mesclaGenetica(10000000)">
              <q-item-section>
                <q-item-label>Molt Acurada</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-btn-group>
    </div>


    <p class="text-h3" v-if="result.length > 0">Resultat</p>
    <q-list v-if="result.length > 0" v-for="(grup,i) in result" bordered class="rounded-borders q-mb-lg">

      <q-item-label header>Grup {{i+1}} ({{grup.membres.length}} membres)</q-item-label>

      <q-expansion-item v-for="membre in grup.membres" expand-icon-toggle expand-separator clickable v-ripple>
        <template v-slot:header>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm">
            <div class="flex">
            {{membre.nom}}
            <span v-if="membre.agrupamentFixe">&nbsp;({{membre.agrupamentFixe}})</span>
            <span v-if="membre.amics.length>0">&nbsp;- <span class="text-green">Amics:</span> {{grup.membres.reduce((total,m)=>{
              if(membre.amics.find(amic=>amic.nom===m.nom)){
                total++;
              }
              return total;
            },0)}}/{{membre.amics.length}}</span>
            <span v-if="membre.enemics.length>0">&nbsp;- <span class="text-red">Enemics:</span> {{grup.membres.reduce((total,m)=>{
              if(membre.enemics.find(enemic=>enemic.nom===m.nom)){
                total++;
              }
              return total;
            },0)}}/{{membre.enemics.length}}</span>

              <span class="q-ml-lg"><q-btn label="Canvia de grup" color="primary" @click="canviGrup(membre)" /></span>
            </div>
          </q-item-label>
        </q-item-section>
        </template>
        <div class="q-pl-lg">
          <p class="text-subtitle2" v-if="membre.amics.length>0">Amics</p>
          <div class="q-pl-lg" v-for="amic in membre.amics">
            <div>- {{ amic.nom }} (Grup {{result.reduce((total,g:Agrupament) => {
                  const trobat:Membre = g.membres.find(m => (m.nom === amic.nom))
                  if(trobat){
                    return total + parseInt(g.numero)
                  }
                  return total;
                },0)
              }})</div>
          </div>
          <p class="text-subtitle2 q-mt-md" v-if="membre.enemics.length>0">Enemics</p>
          <div class="q-pl-lg q-pb-lg" v-for="enemic in membre.enemics">
            <div>- {{ enemic.nom }} (Grup {{result.reduce((total,g:Agrupament) => {
              const trobat:Membre = g.membres.find(m => (m.nom === enemic.nom))
              if(trobat){
                return total + parseInt(g.numero)
              }
              return total;
            },0)
              }})</div>
          </div>
        </div>
      </q-expansion-item>

      <q-item clickable v-ripple>Total membres: {{grup.membres.length}}</q-item>
      <q-item v-for="item in grupCooperatiu.itemsGrupCooperatiu" clickable v-ripple>
        <q-item-section top class="gt-sm">
          <q-item-label class="q-mt-sm">{{item.item.nom}}</q-item-label>
          <q-item-label v-for="valorItem in item.item.valorsMapped" class="q-mt-sm">{{valorItem.label}} {{countValorItemMembers(valorItem,grup.membres)}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--div v-show="result.length > 0">
      <q-select
        :model-value="itemChart"
        :options="itemOptions"
        label="Ítem a visualitzar"
        class="q-mb-lg"
        @input-value="paintGraph"
        @update:model-value="paintGraph"
      />
      <canvas id="myChart" width="400" height="400"></canvas>
    </div-->

    <q-btn color="primary" label="Desar" icon="save" @click="desa" class="q-my-lg" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Item} from "src/model/apps/grupsCooperatius/Item";
import {ItemGrupCooperatiu} from "src/model/apps/grupsCooperatius/ItemGrupCooperatiu";
import {UsuariService} from "src/service/UsuariService";
import {Usuari} from "src/model/Usuari";
import {GrupCooperatiuService} from "src/service/GrupCooperatiuService";
import {GrupCorreu} from "src/model/google/GrupCorreu";
import {GrupCorreuService} from "src/service/GrupCorreuService";
import {Membre} from "src/model/apps/grupsCooperatius/Membre";
import {Agrupament} from "src/model/apps/grupsCooperatius/Agrupament";
import {ValorItem} from "src/model/apps/grupsCooperatius/ValorItem";
import {ValorItemMembre} from "src/model/apps/grupsCooperatius/ValorItemMembre";
import Chart from 'chart.js/auto'
import {GrupCooperatiu} from "src/model/apps/grupsCooperatius/GrupCooperatiu";
import {QTableColumn} from "quasar";



export default defineComponent({
  name: 'PageGrupCorreuForm',
  data() {
    return {
      numGrups: 2,
      members: [] as Membre[],
      grupCooperatiu: {
        itemsGrupCooperatiu: [] as ItemGrupCooperatiu[],
      } as GrupCooperatiu,
      userManualSelected: '',
      userSelected:[] as Usuari[],
      grupSelected: [] as GrupCorreu[],
      itemSelected: [] as Item[],
      userOptions: new Array<{label:string, value:string}>(),
      grupOptions: new Array<{label:string, value:string}>(),
      itemOptions: new Array<{label:string, value:string}>(),
      filterUsuaris: '',
      filterGrups: '',
      filterItems: '',
      users: [] as Usuari[],
      grups: [] as GrupCorreu[],
      items: [] as Item[],
      percentatgeAmics: 100,
      percentatgeEnemics: 100,
      result:[] as Agrupament[],
      itemChart: null,
      columnes: []  as QTableColumn[],
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

      const usuaris:Array<Usuari>= await UsuariService.findUsuarisActius();
      this.users=usuaris;

      const grupsCorreu:Array<GrupCorreu> = await GrupCorreuService.findAll();
      this.grups = grupsCorreu;

      const items:Array<Item>= await GrupCooperatiuService.getItems();
      this.items = items;

      this.userOptions = this.users.map((user:Usuari)=>{
        return {
          label: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom +' ('+user.email+')',
          value: user.email
        }
      })

      this.grupOptions = this.grups.map(grup=>{
        return {
          label: grup.nom + ' ('+grup.email+')',
          value: grup.email
        }
      })

      this.itemOptions = this.items.map(item=>{
        return {
          label: item.nom,
          value: item.id!.toString()
        }
      })

      this.columnes = [
        {
          name: 'esborrar',
          required: true,
          label: '',
          align: 'left',
          field: row => row.id,
          sortable: false
        },
        {
          name: 'idmembre',
          required: true,
          label: 'Membre',
          align: 'left',
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'amics',
          required: true,
          label: 'Amics',
          align: 'left',
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'enemics',
          required: true,
          label: 'Enemics',
          align: 'left',
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'agrupamentFixe',
          required: true,
          label: 'Agrupament',
          align: 'left',
          field: row => row.agrupamentFixe,
          sortable: true
        }
      ]

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        const grupCooperatiu:GrupCooperatiu = await GrupCooperatiuService.getGrupsCooperatiuById(parseInt(id));

        this.grupCooperatiu = grupCooperatiu;
        console.log("Grup Cooperatiu",this.grupCooperatiu);

        this.members = grupCooperatiu.membres.map(m=>{
          if(m.amics && m.amics.length>0) {
            m.amics = m.amics.map((amic:any) => amic.nom).sort((a:any,b:any)=>a.localeCompare(b));
          }
          if(m.enemics && m.enemics.length>0) {
            m.enemics = m.enemics.map((enemic:any) => enemic.nom).sort((a:any,b:any)=>a.localeCompare(b));
          }
          return m;
        });

        this.numGrups = grupCooperatiu.agrupaments.length;

        await this.updateMembersItems()

        //console.log(this.members);
        for (let igc of grupCooperatiu.itemsGrupCooperatiu) {
          //console.log("IGC",igc)
          this.columnes.push({
            name: 'item_'+igc.item.id+'',
            required: true,
            label: igc.item.nom,
            align: 'left',
            field: 'item_'+igc.item.id+'',
            sortable: true
          })

          /*console.log(igc.item,igc.item.valorsItem)
          const valorItem:ValorItem|undefined = (igc.item.valorsItem)?igc.item.valorsItem[0]:undefined;
          if(valorItem!=undefined) {
            console.log("valor item no es undefined")
            this.members.forEach((membre: Membre) => {
              membre.valorsItemMembre.push({
                membre: membre,
                valorItem: valorItem
              })
            })
          }*/
        }

        await this.updateMembersItems()

        //Agrupaments
        this.result = grupCooperatiu.agrupaments.sort((a,b)=>a.numero-b.numero);
      }

      dialog.hide();
    },
    deleteMember: async function(member:Membre){
      this.members = this.members.filter(m=>{
        return m != member
      })

      await this.updateMembersItems()
    },
    deleteItem: async function (item: ItemGrupCooperatiu){
      this.grupCooperatiu.itemsGrupCooperatiu = this.grupCooperatiu.itemsGrupCooperatiu.filter(i=>{
        return i.item.id != item.item.id
      })
      await this.updateMembersItems()
    },
    addUserManual() {
      const member:Membre = {
        nom: this.userManualSelected,
        valorsItemMembre: [],
        valorsItemMapped: [],
        amics: [],
        enemics: [],
        label: this.userManualSelected,
        value: this.userManualSelected
      }
      this.members.push(member)
      this.members.sort((a,b)=>a.nom.localeCompare(b.nom))
      this.userManualSelected = '';
    },
    async setUserModel (val:string) {
      const usuari:Usuari|undefined = this.users.find(user=> {
        return user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom + ' ('+user.email+')' === val
      });
      if(usuari){
        //console.log("UsuariWebIesManacorDepartaments.ts ",usuari);
        const member:Membre = {
          nom: usuari.cognom1 + ' ' + usuari.cognom2 + ', ' + usuari.nom,
          valorsItemMembre: [],
          valorsItemMapped: [],
          amics: [],
          enemics: [],
          label: usuari.cognom1 + ' ' + usuari.cognom2 + ', ' + usuari.nom,
          value: usuari.cognom1 + ' ' + usuari.cognom2 + ', ' + usuari.nom
        }
        this.members.push(member)
        this.members.sort((a,b)=>a.nom.localeCompare(b.nom))
        this.userSelected = [];
      }

      await this.updateMembersItems()
    },
    async setGrupModel (val:string) {
      //console.log("setGrupModel",val)
      let grup:GrupCorreu|undefined = this.grups.find(grup=> {
        return grup.nom + ' ('+grup.email+')' === val
      })
      if(grup){
        const grupCorreuUsuaris:GrupCorreu|undefined = await GrupCorreuService.getGrupAmbUsuaris(grup);
        if(grupCorreuUsuaris && grupCorreuUsuaris.usuaris) {
          grupCorreuUsuaris.usuaris.forEach((user: Usuari) => {
            this.members.push({
              nom: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom,
              valorsItemMembre: [],
              valorsItemMapped: [],
              amics:[],
              enemics:[],
              label: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom,
              value: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom
            })
            this.grupSelected = [];
          })
        }
      }

      this.members.sort((a,b)=>a.nom.localeCompare(b.nom))

      await this.updateMembersItems()
    },
    async setItemModel (val:string) {
      const grupCooperatiu:GrupCooperatiu = this.grupCooperatiu;
      //console.log(val);
      let item = this.items.find(item=> {
        return item.nom === val
      })
      if(item){
        this.grupCooperatiu.itemsGrupCooperatiu.push({
          grupCooperatiu: grupCooperatiu,
          item: item,
          percentatge: 100
        })

        const valorItem:ValorItem|undefined = (item.valorsItem)?item.valorsItem[0]:undefined;
        if(valorItem!=undefined) {
          this.members.forEach((membre: Membre) => {
            membre.valorsItemMembre.push({
              membre: membre,
              valorItem: valorItem
            })
          })
        }

        this.itemSelected = [];

        //Actualitzem les columnes
        console.log("key columna:",'item_'+item.id+'')
        this.columnes.push({
          name: 'item_'+item.id+'',
          required: true,
          label: item.nom,
          align: 'left',
          field: 'item_'+item.id+'',
          sortable: true
        })
      }
      await this.updateMembersItems()
    },
    userFilterFn (val:string, update:Function) {
      if (val === '') {
        update(() => {
          this.userOptions = this.users.map(user=>{
            return {
              label: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom + ' ('+user.email+')',
              value: user.email
            }
          })
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.userOptions = this.users.filter(v => {
          let cognom1 = false;
          let cognom2 = false;
          let nom = false;
          let email = false;

          if(v.nom) {
            nom = v.nom.toLowerCase().indexOf(needle) > -1
          }

          if(v.cognom1) {
            cognom1 = v.cognom1.toLowerCase().indexOf(needle) > -1
          }

          if(v.cognom2) {
            cognom2 = v.cognom2.toLowerCase().indexOf(needle) > -1
          }

          if(v.email) {
            email = v.email.toLowerCase().indexOf(needle) > -1
          }
          return  nom || cognom1 || cognom2 || email;
        }).map(user=>{
          return {
            label: user.cognom1 + ' ' + user.cognom2 + ', ' + user.nom + ' ('+user.email+')',
            value: user.email
          }
        })
      })
    },
    grupFilterFn (val:string, update:Function) {
      if (val === '') {
        update(() => {
          this.grupOptions = this.grups.map(grup=>{
            return {
              label: grup.nom + ' ('+grup.email+')',
              value: grup.email
            }
          })
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
        }).map(grup=>{
          return {
            label: grup.nom + ' ('+grup.email+')',
            value: grup.email
          }
        })
      })
    },
    itemFilterFn (val:string, update:Function) {
      if (val === '') {
        update(() => {
          this.itemOptions = this.items.map(item=>{
            return {
              label: item.nom,
              value: item.id!.toString()
            }
          })
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.itemOptions = this.items.filter(v => {
          let nom = false;

          if(v.nom) {
            nom = v.nom.toLowerCase().indexOf(needle) > -1
          }
          return nom;
        }).map(item=>{
          return {
            label: item.nom,
            value: item.id!.toString()
          }
        })
      })
    },
    async updateMembersItems(){
      //Actualitzam items de membres
      this.members.forEach( (m:Membre) =>{
        //inicialitzem o actualitzem
        if(!m.valorsItemMembre) {
          m.valorsItemMembre = [];
        } else {
          //Esborrem ítems que no estiguin seleccionats, és a dir, filtrem nomes els ítems que són dins l'array delm grup cooperatiu
          //m.valorsItemMembre = m.valorsItemMembre.filter((it)=>this.grupCooperatiu.items.find((it2)=>it.valorItem.item?.id===it2.item.id));
        }

        /*if(!m.valorsItemMapped){
          m.valorsItemMapped = [];
        }*/

        //Actualitzem valors del llistat de cada ítem, és a dir, el select amb les opcions disponibles
        this.grupCooperatiu.itemsGrupCooperatiu.forEach(async (itemGrupCooperatiu:ItemGrupCooperatiu,index)=>{
          const valorsItem = await GrupCooperatiuService.getValorItems(itemGrupCooperatiu.item);

          itemGrupCooperatiu.item.valorsItem = valorsItem;
          //Clonem l'array d'objectes amb spread {...a}
          const clonedValorsItem = valorsItem.map(a => {return {...a}})
          itemGrupCooperatiu.item.valorsMapped = clonedValorsItem.map((v:ValorItem)=>{
            return {
              label:v.valor + ' (' + v.pes+'%)',
              value:v.id+''
            }
          })

          //Si el valor de la llista desplegable dels ítems està buit, posem el primer valor per defecte
          //Així s'estalvien anar un per un a posar tots els valors, el primer ja vindrà seleccionat.
          //Aquí canviem el valor del model pel primer ítem de la llista
          //console.log(m,itemGrupCooperatiu);
          //Update mescla


          //console.log("valor inicial",m.valorsItemMapped[index])
          if(!m.valorsItemMapped[index]){ //Create mescla
            m.valorsItemMapped[index] = itemGrupCooperatiu.item.valorsMapped[0];
          }

          /*if(m.valorsItemMembre && m.valorsItemMembre.length >0){
            console.log("Load valors",m,itemGrupCooperatiu.item);
            m.valorsItemMapped[index] = m.valorsItemMapped.find(vim=> {
              const it:any = m.valorsItemMembre[0].valorItem.item!;
              return vim.value == it.iditem
            })!
          }*/

        })
      })

      //dialog.hide();
    },
    mesclaAleatoria: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      //Clonem l'objecte
      const grupCooperatiu = {...this.grupCooperatiu};
      grupCooperatiu.itemsGrupCooperatiu.map(item=> {
        delete item.grupCooperatiu
        delete item.item.valorsItem
      })

      const mescla = {
        grupCooperatiu: grupCooperatiu,
        members: this.members,
        numGrups: this.numGrups
      }

      //Fem lo de JSON per convertir l'objecte Proxy a array pla
      const grups = await this.$axios.post(process.env.API + '/apps/grupscooperatius/aleatori',mescla);
      if(grups.data && grups.data.notifyType && grups.data.notifyType !== "ERROR") {
        this.result = grups.data.sort((a:Agrupament,b:Agrupament)=>a.numero-b.numero)

        //Ordenem els membres de cada grup per nom
        this.result.map((g: any) => g.membres.sort((a: any, b: any) => a.nom.localeCompare(b.nom)))
      }
      dialog.hide();
    },
    mesclaGenetica: async function(iteracions:number){
      const dialog = this.$q.dialog({
        message: 'Processant dades, un moment per favor...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      //Clonem l'objecte
      const grupCooperatiu = {...this.grupCooperatiu};
      grupCooperatiu.itemsGrupCooperatiu.map(item=> {
        delete item.grupCooperatiu
        delete item.item.valorsItem
      })
      const mescla = {
        grupCooperatiu: grupCooperatiu,
        members: this.members,
        numGrups: this.numGrups,
        iteracions: iteracions,
        percentatgeAmics: this.percentatgeAmics,
        percentatgeEnemics: this.percentatgeEnemics
      }
      const grups = await this.$axios.post(process.env.API + '/apps/grupscooperatius/genetica',mescla);

      //Comprovem que es torna una mescla i no una notificació (errors...)
      if(grups.data && !grups.data.notifyType) {
        this.result = grups.data.sort((a:Agrupament,b:Agrupament)=>a.numero-b.numero)

        //Ordenem els membres de cada grup per nom
        this.result.map((g: any) => g.membres.sort((a: any, b: any) => a.nom.localeCompare(b.nom)))
      }

      await this.updateMembersItems()
      //this.paintGraph()
      dialog.hide();
    },
    countValorItemMembers(valorItem:{label:string;value:string},membres:Membre[]) {

      let count:number = 0;
      membres.forEach((m:Membre)=>{
        //console.log(m.nom,m.valorsItemMembre,valorItem)
        m.valorsItemMembre.forEach((vim:any)=>{
          if((vim.valorItem.idvalorItem)===parseInt(valorItem.value)){
            count++;
          }
        })
      })
      return count;
    },
    desa: function(){
      const resultat:Agrupament[] = this.result;
      const members:Membre[] = this.members;

      const grupCooperatiu:GrupCooperatiu = {...this.grupCooperatiu};
      grupCooperatiu.itemsGrupCooperatiu.map(item=> {

        for(let member of members){
          member.valorsItemMembre = member.valorsItemMapped.map(vim=>{
            const valorItem:ValorItem = {
              id: parseInt(vim.value),
              item: {...item.item},
              pes: item.percentatge,
              valor: vim.label
            }

            const valorItemMembre:ValorItemMembre = {
              membre: member,
              valorItem: valorItem
            }

            delete valorItemMembre.membre;

            return valorItemMembre;
          });
        }

        delete item.grupCooperatiu
        delete item.item.valorsItem
      })


      const numGrups:number = this.numGrups;
      GrupCooperatiuService.saveMescla(grupCooperatiu,resultat,members,numGrups);
    },
    canviGrup(membre:Membre){
      this.$q.dialog({
        title: 'Prompt',
        message: 'Quin grup nou vols assignar el membre?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        const nouGrup:Number=data;
        console.log(this.result,membre);
        this.result = this.result.sort((a,b)=>a.numero-b.numero)
        this.result = this.result.map((agrupament:Agrupament)=>{
          const a:Agrupament = {...agrupament};
          if(a.numero!=nouGrup){
            console.log("Esborrant membre "+membre.nom)
            a.membres = a.membres.filter((membreGrup:Membre)=>membreGrup.nom!==membre.nom)
          }
          if(nouGrup===a.numero){
            console.log("Afegint membre al grup " +nouGrup+': '+membre.nom)
            a.membres.push(membre)
            a.membres.sort((a: any, b: any) => a.nom.localeCompare(b.nom))
          }
          return a;
        })
      })
    },
    paintGraph(){
      /*if(this.chart !== null){
        this.chart.destroy();
      }*/
      console.log("Repintar gràfic",this.itemChart)
      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
      if(ctx != null) {
        const result = this.result;
        const labels = result.map((r,idx)=>'Grup '+idx);
        const datasets = [];
        result.forEach(grup=>{
          const dataset = {};
          grup.membres.forEach(membre=>{

          })
        })
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          }
        });
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.sticky-nom-table {
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%;

  thead tr:first-child th:first-child,thead tr:first-child th:nth-child(2){
    /* bg color is important for th; just specify one */
    background-color: #fff;
  }

  td:first-child, td:nth-child(2) {
    background-color: #f5f5dc;
  }

  th:first-child, th:nth-child(2),  td:first-child, td:nth-child(2) {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>
