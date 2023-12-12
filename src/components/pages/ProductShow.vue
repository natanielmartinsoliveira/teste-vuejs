<template>
  <layout-div>
       <h2 class="text-center mt-5 mb-3">Show Product</h2>
       <div class="card">
           <div class="card-header">
               <router-link 
                   class="btn btn-outline-info float-right"
                   to="/all">View All Products
               </router-link>
           </div>
           <div class="card-body">
               <b className="text-muted">Name:</b>
               <p>{{produto.nome}}</p>
               <b className="text-muted">Description:</b>
               <p>{{produto.descricao}}</p>
               <b className="text-muted">Preço:</b>
               <p>{{'R$ '+formatPrice}}</p>
               <b className="text-muted">Validade:</b>
               <p>{{formattedDate}}</p>
               <b className="text-muted">Arquivo:</b>
               <p>{{produto.arquivo}}</p>
               <b className="text-muted">Categoria:</b>
               <p>{{formattedDate}}</p>
           </div>
       </div>
  </layout-div>
</template>
<script setup>

import { reactive, onMounted, computed } from 'vue';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import ProdutosService from "../../services/produtos.service";
import { useRoute } from 'vue-router';

let produto = reactive({
        nome: '',
        descricao: '',
        preco: 0,
        validade: new Date(),
        arquivo: [],
        categoria_id: ''
      });
      
const route = useRoute();

onMounted(() => {

  const id = route.params.id;
  ProdutosService.getProdutosId(id).then(
    (response) => {
      let productInfo = response.data.data
      produto.nome = productInfo.nome
      produto.descricao = productInfo.descricao
      produto.preco = productInfo.preco;
      produto.validade = new Date(productInfo.validade);
      produto.arquivo = productInfo.arquivo;
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

const formattedDate = computed(() => {
    const day = produto.validade.getDate().toString().padStart(2, "0");
    const month = (produto.validade.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const year = produto.validade.getFullYear().toString();

    return `${day}/${month}/${year}`;
});

const formatPrice = computed(() =>  {
    let val = (produto.preco/1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
});

</script>
