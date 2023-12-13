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
            <Form @submit="handleSave" :validation-schema="schema">
                <div class="form-group">
                    <label htmlFor="nome">Nome</label>
                    <Field 
                        v-model="produto.nome"
                        type="text"
                        class="form-control"
                        id="nome"
                        name="nome"/>
                    <ErrorMessage name="nome" class="error-feedback" />
                </div>
                <div class="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <Field as="textarea" 
                        v-model="produto.descricao"
                        class="form-control"
                        id="descricao"
                        rows="3"
                        name="descricao"></Field>
                    <ErrorMessage name="descricao" class="error-feedback" />
                </div>
                <div class="form-group">
                    <label htmlFor="preco">Preco</label>
                    <CurrencyInput
                        id="preco"
                        :options="{ currency: 'BRL' }"
                        v-model="produto.preco"
                    />
                </div>
                <div class="form-group">
                    <label htmlFor="Validade">Validade</label>
                    <Datepicker htmlFor="Validade" name="Validade" v-model="produto.validade" format="yyyy-MM-dd"  />
                </div> 
    
                <div class="form-group">
                    <label htmlFor="upload">Arquivo</label>
                    <FileUpload class="form-control"
                      v-model="produto.arquivo"
                      name="upload" id="upload"
                    />
                    <ErrorMessage name="upload" class="error-feedback" />
                </div>


                <div class="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <Field as="div" 
                        v-slot="{ field }" 
                        v-model="produto.categoria_id"
                        name="categoria" 
                        @change="changeCategoria($event)"
                    >
                        <select v-bind="field" class="form-control" >
                            <option>Selecione uma Categoria</option>
                            <option v-for="(categoria) in categorias" v-bind:key="categoria.id" :value="categoria.id" >{{categoria.nome}}</option>
                        </select>
                        <ErrorMessage name="categoria" class="error-feedback" />
                    </Field>
                </div>
                

                <button 
                    :disabled="isSaving"
                    type="submit"
                    class="btn btn-outline-primary mt-3">
                    Salvar Produto
                </button>
            </Form>

        </div>
    </div>
  </layout-div>
</template>
<script setup>

import { reactive, onMounted } from 'vue'
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import CurrencyInput from '../CurrencyInput';
import ProdutosService from "../../services/produtos.service";
import FileUpload from '../FileUpload';
import CategoriasService from "../../services/categorias.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter } from 'vue-router';

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
 const route = useRouter();
 
 const schema = yup.object().shape({
    nome: yup
      .string()
      .required("Nome é Obrigatorio!")
      .min(3, "Precisa ser maior que 3 caracteres!")
      .max(50, "Precisa ser no maximo 100 caracteres!"),
    descricao: yup
      .string()
      .required("Descricao é Obrigatorio!")
      .min(10, "Precisa ser maior que 3 caracteres!")
      .max(100, "Precisa ser no maximo 100 caracteres!"),
    categoria: yup
      .number()
      .required("Categoria é Obrigatorio!")
  });

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
})

 function handleSave() {
    alert('');
    isSaving = true
    ProdutosService.getCreateSave(produto).then(
    (response) => {
        Swal.fire({
            icon: 'success',
            title: 'Project saved successfully!',
            showConfirmButton: false,
            timer: 1500
        })
        isSaving = false
        produto.nome = ""
        produto.descricao = ""
        produto.preco = 0
        produto.validade = new Date()
        produto.arquivo = ""
        produto.categoria_id = 0
        route.push({ path: '/all' })
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
  console.log('value',event.target.value,produto.categoria_id);
 }

</script>
