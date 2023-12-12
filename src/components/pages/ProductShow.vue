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
               <p>{{product.nome}}</p>
               <b className="text-muted">Description:</b>
               <p>{{product.descricao}}</p>
               <b className="text-muted">Preço:</b>
               <p>{{'R$ '+formatPrice}}</p>
               <b className="text-muted">Validade:</b>
               <p>{{formattedDate}}</p>
               <b className="text-muted">Arquivo:</b>
               <p>{{product.arquivo}}</p>
               <b className="text-muted">Categoria:</b>
               <p>{{formattedDate}}</p>
           </div>
       </div>
  </layout-div>
</template>

<script>

import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
import ProdutosService from "../../services/produtos.service";

export default {
 name: 'ProductShow',
 components: {
   LayoutDiv,
 },
 data() {
   return {
     product: {
       name: '',
       description: '',
       preco: '',
       validade: new Date(),
     },
     isSaving:false,
   };
 },
 computed: {
    formattedDate() {
      const day = this.product.validade.getDate().toString().padStart(2, "0");
      const month = (this.product.validade.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const year = this.product.validade.getFullYear().toString();

      return `${day}/${month}/${year}`;
    },
    formatPrice() {
        let val = (this.product.preco/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
 },
 created() {
   const id = this.$route.params.id;
   ProdutosService.getProdutosId(id).then(
      (response) => {
        let productInfo = response.data.data
        this.product.nome = productInfo.nome
        this.product.descricao = productInfo.descricao
        this.product.preco = productInfo.preco;
        this.product.validade = new Date(productInfo.validade);
        this.product.arquivo = productInfo.arquivo;
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
 },
 methods: {
    
 },
};
</script>