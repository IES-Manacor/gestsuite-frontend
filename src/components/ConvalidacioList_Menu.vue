<template>
  <q-btn-group push class="q-mb-lg">
    <q-btn  color="primary" label="Sol·licituds" icon="settings" :to="'/apps/convalidacions/solicituds'" />
    <q-btn  color="primary" label="Convalidacions" icon="settings" :to="'/apps/convalidacions/convalidacions'" />
    <q-btn  color="primary" label="Titulacions" icon="settings" :to="'/apps/convalidacions/titulacions'" />
    <q-btn  color="primary" label="Categories" icon="settings" :to="'/apps/convalidacions/categories'" />
  </q-btn-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Rol} from "src/model/Rol";

export default defineComponent({
  name: 'ConvalidacioList_Menu',
  setup(){
    const rolsUser:string[] = JSON.parse(localStorage.getItem("rol")??"") || []; //Inicialitzem a un array buit si no existeix cap rol
    const rols = Rol;

    return {
      rolsUser,
      rols,
    }
  }
});
</script>
