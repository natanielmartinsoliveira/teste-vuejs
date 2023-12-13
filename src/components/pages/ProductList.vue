<template>
  <layout-div>
        <div class="container">
            <h2 class="text-center mt-5 mb-3">Produtos Manager</h2>
            <div class="card">
                <div class="card-header">
                    <router-link to="/create"
                        class="btn btn-outline-primary"
                        >Criar novo Produto
                    </router-link>
                </div>
                <div class="card-body">
                    <div class="container">
                      <div class="row text-center border-bottom mb-2 pb-2">
                        <div class="col-sm text-center d-none d-md-block ">
                          Nome
                        </div>
                        <div class="col-sm text-center d-none d-md-block ">
                          Descricao
                        </div>
                        <div class="col-sm text-center d-none d-md-block ">
                          Preço
                        </div>
                        <div class="col-sm text-center d-none d-md-block ">
                          Validade
                        </div>
                        <div class="col-sm text-center d-none d-md-block ">
                          Arquivo
                        </div>
                        <div class="col-sm text-center d-none d-md-block ">
                          Categoria
                        </div>
                        <div class="col-md-4 text-center d-none d-md-block ">
                          Ações
                        </div>
                      </div>
           
                      <div class="row border-bottom mb-2 pb-2" v-for="produto in items" :key="produto.id">
                        <div class="col-sm">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Nome : {{produto.nome}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            {{produto.nome}}
                          </div> 
                        </div>
                        <div class="col-sm">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Descricao : {{produto.descricao}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            {{produto.descricao}}
                          </div> 
                        </div>
                        <div class="col-sm text-center">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Preço : R$ {{formatPrice(produto.preco)}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            R$ {{formatPrice(produto.preco)}}
                          </div> 
                        </div>
                        <div class="col-sm text-center">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Validade : {{formattedDate(new Date(produto.validade))}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            {{formattedDate(new Date(produto.validade))}}
                          </div>                       
                        </div>
                        <div class="col-sm text-center">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Arquivo : {{produto.arquivo}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            {{produto.arquivo}}
                          </div>
                        </div>
                        <div class="col-sm text-center">
                          <div class="text-center d-block d-sm-block d-md-none">
                            Categoria : {{produto.categoria}}
                          </div>
                          <div class="text-center d-none d-md-block">
                            {{produto.categoria}}
                          </div>
                          
                        </div>
                        <div class="col-md-4 text-center">
                            <router-link :to="`/show/${produto.id}`" class="btn btn-outline-info mx-1">Ver</router-link>
                            <router-link :to="`/edit/${produto.id}`" class="btn btn-outline-success mx-1">Editar</router-link>
                            <button 
                                @click="handleDelete(produto.id)"
                                className="btn btn-outline-danger mx-1">
                                Apagar
                            </button>
                        </div>
                      </div>
                    </div>    
                 
        
                    <div class="text-center">
                      <vue-awesome-paginate :total-items="totalItems" v-model="currentPage" />
                    </div>
                    
                </div>
            </div>
        </div>
    </layout-div>

    
</template>
<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import ProdutosService from "../../services/produtos.service";

  let currentPage = ref(1);
  let totalItems = ref(20);
  let items = ref();

  computed(() => {
    return items.value.length
  });

  watch(currentPage, (currentValue) => {
    fetchProdutosList(currentValue);
  });

  onMounted(() => {
    fetchProdutosList(1);
  });

   function fetchProdutosList(page) {
    if(typeof page !== undefined){
      ProdutosService.getProdutosPage(page).then(
        (response) => {
          console.log(response);
          items.value = response.data.data;
          //perPage = response.data.meta.per_page;
          totalItems.value = response.data.meta.total;
          return response
        },
        (error) => {
          return error
        });
    }
      
   }

   function formattedDate(date) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const year = date.getFullYear().toString();

      return `${day}/${month}/${year}`;
    }

    function formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    function handleDelete(id){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {

                ProdutosService.getDelete(id).then(
                (response) => {
                  Swal.fire({
                      icon: 'success',
                      title: 'Produto deleted successfully!',
                      showConfirmButton: false,
                      timer: 1500
                  })
                  fetchProdutosList();
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
            }
          })
    }

</script>



<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
    
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>