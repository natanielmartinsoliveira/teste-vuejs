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
                           v-model="produtos.nome"
                           type="text"
                           class="form-control"
                           id="name"
                           name="name"/>
                   </div>
                   <div class="form-group">
                       <label htmlFor="description">Description</label>
                       <textarea 
                           v-model="produtos.descricao"
                           class="form-control"
                           id="description"
                           rows="3"
                           name="description"></textarea>
                   </div>

                   <div class="form-group">
                      <label htmlFor="Validade">Validade</label>
                      <Datepicker htmlFor="Validade" v-model="produtos.validade" />
                  </div>

                  <div class="form-group">
                      <label htmlFor="preco">Preço</label>
                      <CurrencyInput
                        v-model="produtos.preco"
                        :options="{ currency: 'BRL' }"
                      />
                   </div>

                   <div class="form-group">
                      <label htmlFor="preco">Categoria</label>
                      <select class="form-control" v-model="produtos.categoria_id" @change="changeCategoria($event)">
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

<script>

import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import CurrencyInput from '../CurrencyInput';
import ProdutosService from "../../services/produtos.service";
import CategoriasService from "../../services/categorias.service";

export default {
 name: 'ProjectEdit',
 components: {
   LayoutDiv,
   Datepicker,
   CurrencyInput 
 },
 data() {
   return {
     produtos: {
       nome: '',
       descricao: '',
       preco: new Number(),
       validade: new Date(),
       arquivo: [],
       categoria_id: ''
     },
     categorias : null,
     isSaving:false,
   };
 },
 created() {
    const id = this.$route.params.id;
    ProdutosService.getProdutosId(id).then(
      (response) => {
        let produtosInfo = response.data.data
        this.produtos.nome = produtosInfo.nome
        this.produtos.descricao = produtosInfo.descricao
        this.produtos.preco = new Number(parseFloat(produtosInfo.preco))
        this.produtos.validade = new Date(produtosInfo.validade)
        this.produtos.arquivo = produtosInfo.arquivo
        this.produtos.categoria_id = parseInt(produtosInfo.categoria_id)
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
    CategoriasService.getCategoriasPage().then(
      (response) => {
        let CategoriasInfo = response.data.data
        this.categorias = CategoriasInfo
        return response
      },
      (error) => {
        return error
      });
 },
 methods: {
   handleSave() {
       this.isSaving = true
       const id = this.$route.params.id;
       ProdutosService.getEditSave(id, this.produtos).then(
        (response) => {
          Swal.fire({
              icon: 'success',
              title: 'Project updated successfully!',
              showConfirmButton: false,
              timer: 1500
          })
           
          let ProdutosInfo = response.data.data;
          this.isSaving = false
          this.produtos.nome = ProdutosInfo.nome
          this.produtos.descricao = ProdutosInfo.descricao
          this.produtos.preco = new Number(ProdutosInfo.preco)
          this.produtos.validade = new Date(ProdutosInfo.validade)
          this.produtos.categoria_id = parseInt(ProdutosInfo.categoria_id)
          return response
        },
        (error) => {
          this.isSaving = false
          Swal.fire({
              icon: 'error',
              title: 'An Error Occured!',
              showConfirmButton: false,
              timer: 1500
          })
          return error
        });
   },
    changeCategoria(event){
      this.produtos.categoria_id = parseInt(event.target.value)
    }
 },
};
</script>