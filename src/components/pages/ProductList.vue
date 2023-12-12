<template>
  <layout-div>
        <div class="container">
            <h2 class="text-center mt-5 mb-3">Produtos Manager</h2>
            <div class="card">
                <div class="card-header">
                    <router-link to="/create"
                        class="btn btn-outline-primary"
                        >Create New Produto
                    </router-link>
                </div>
                <div class="card-body">
             
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descricao</th>
                                <th>Preço</th>
                                <th>Validade</th>
                                <th>Arquivo</th>
                                <th>Categoria</th>
                                <th width="240px">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                             
                            <tr v-for="produto in items" :key="produto.id">
                                <td>{{produto.nome}}</td>
                                <td>{{produto.descricao}}</td>
                                <td>R$ {{formatPrice(produto.preco)}}</td>
                                <td>{{formattedDate(new Date(produto.validade))}}</td>
                                <td>{{produto.arquivo}}</td>
                                <td>{{produto.categoria}}</td>
                                <td>
                                    <router-link :to="`/show/${produto.id}`" class="btn btn-outline-info mx-1">Show</router-link>
                                    <router-link :to="`/edit/${produto.id}`" class="btn btn-outline-success mx-1">Edit</router-link>
                                    <button 
                                        @click="handleDelete(produto.id)"
                                        className="btn btn-outline-danger mx-1">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                                 
                        </tbody>
                    </table>
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