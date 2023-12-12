<template>
  <layout-div>
       <h2 class="text-center mt-5 mb-3">Edit Produto</h2>
       <div class="card">
           <div class="card-header">
               <router-link 
                   class="btn btn-outline-info float-right"
                   to="/all">View All Produtos
               </router-link>
           </div>
           <div class="card-body">
               <form>
                   <div class="form-group">
                       <label htmlFor="name">Name</label>
                       <input 
                           v-model="produto.nome"
                           type="text"
                           class="form-control"
                           id="name"
                           name="name"/>
                   </div>
                   <div class="form-group">
                       <label htmlFor="description">Description</label>
                       <textarea 
                           v-model="produto.descricao"
                           class="form-control"
                           id="description"
                           rows="3"
                           name="description"></textarea>
                   </div>

                   <div class="form-group">
                      <label htmlFor="Validade">Validade</label>
                      <Datepicker htmlFor="Validade" v-model="produto.validade" />
                  </div>

                  <div class="form-group">
                      <label htmlFor="preco">Preço</label>
                      <CurrencyInput
                        v-model="produto.preco"
                        :options="{ currency: 'BRL' }"
                      />
                   </div>

                   <div class="form-group">
                      <label htmlFor="preco">Categoria</label>
                      <select class="form-control" v-model="produto.categoria_id" @change="changeCategoria($event)">
                          <option>Choose Categoria</option>
                          <option v-for="(categoria) in categorias" v-bind:key="categoria.id" :value="categoria.id" >{{categoria.nome}}</option>
                      </select>
                  </div>

                   <button 
                       @click="handleSave()"
                       :disabled="isSaving"
                       type="button"
                       class="btn btn-outline-primary mt-3">
                       Save Produtos
                   </button>
               </form>
           </div>
       </div>
  </layout-div>
</template>
<script setup>

import { reactive, onMounted } from 'vue';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import CurrencyInput from '../CurrencyInput';
import ProdutosService from "../../services/produtos.service";
import CategoriasService from "../../services/categorias.service";
import { useRoute } from 'vue-router';

 let produto = reactive({
        nome: '',
        descricao: '',
        preco: 0,
        validade: new Date(),
        arquivo: [],
        categoria_id: ''
      });
 let categorias = reactive();
 let isSaving = reactive();
 const route = useRoute();
 onMounted(() => {

  CategoriasService.getCategoriasPage().then(
    (response) => {
      let CategoriasInfo = response.data.data
      categorias = CategoriasInfo
      return response
    },
    (error) => {
      return error
  });
  
  const id = route.params.id;

  ProdutosService.getProdutosId(id).then(
    (response) => {
      let produtosInfo = response.data.data
      produto.nome = produtosInfo.nome
      produto.descricao = produtosInfo.descricao
      produto.preco = new Number(parseFloat(produtosInfo.preco))
      produto.validade = new Date(produtosInfo.validade)
      produto.arquivo = produtosInfo.arquivo
      produto.categoria_id = parseInt(produtosInfo.categoria_id)
      return response
    },
    (error) => {
      Swal.fire({
          icon: 'error',
          title: 'An Error Occured!',
          showConfirmButton: false,
          timer: 1500
      })
      return error
    });
  });

  function handleSave() {
    isSaving = true
    const id = route.params.id;
    ProdutosService.getEditSave(id, produto).then(
    (response) => {
      Swal.fire({
          icon: 'success',
          title: 'Project updated successfully!',
          showConfirmButton: false,
          timer: 1500
      })
        
      let ProdutosInfo = response.data.data;
      isSaving = false
      produto.nome = ProdutosInfo.nome
      produto.descricao = ProdutosInfo.descricao
      produto.preco = new Number(ProdutosInfo.preco)
      produto.validade = new Date(ProdutosInfo.validade)
      produto.categoria_id = parseInt(ProdutosInfo.categoria_id)
      return response
    },
    (error) => {
      isSaving = false
      Swal.fire({
          icon: 'error',
          title: 'An Error Occured!',
          showConfirmButton: false,
          timer: 1500
      })
      return error
    });
  }

  function changeCategoria(event){
    produto.categoria_id = parseInt(event.target.value)
  }

</script>
