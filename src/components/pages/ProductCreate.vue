<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Create New Produto</h2>
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
                    <label htmlFor="preco">Preco</label>
                    <CurrencyInput
                          v-model="produto.preco"
                          :options="{ currency: 'BRL' }"
                        />
                </div>
                <div class="form-group">
                    <label htmlFor="Validade">Validade</label>
                    <Datepicker htmlFor="Validade" v-model="produto.validade" />
                </div> 
    
                <div class="form-group">
                    <label htmlFor="preco">Preco</label>
                    <FileUpload class="form-control"
                      v-model="produto.arquivo"
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
                    Save Project
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
import FileUpload from '../FileUpload';
import CategoriasService from "../../services/categorias.service";

export default {
  name: 'ProductCreate',
  components: {
    LayoutDiv,
    Datepicker,
    CurrencyInput,
    FileUpload
  },
  data() {
    return {
      produto: {
        nome: '',
        descricao: '',
        preco: 0,
        validade: new Date(),
        arquivo: [],
        categoria_id: ''
      },
      categorias : null,
      isSaving:false,
    };
  },
 created() {
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
        ProdutosService.getCreateSave(this.produto).then(
        (response) => {
            Swal.fire({
                icon: 'success',
                title: 'Project saved successfully!',
                showConfirmButton: false,
                timer: 1500
            })
            this.isSaving = false
            this.produto.nome = ""
            this.produto.descricao = ""
            this.produto.preco = 0
            this.produto.validade = new Date()
            this.produto.arquivo = ""
            this.produto.categoria_id = ""
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
      console.log('value',event.target.value,this.produto.categoria_id);
    }
  },
};
</script>