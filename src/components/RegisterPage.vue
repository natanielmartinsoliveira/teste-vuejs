<template>
    <div class="col-md-12">
      <div class="card card-container">

        <Form @submit="handleRegister" :validation-schema="schema">
          <div v-if="!successful">
            <div class="form-group">
              <label for="Nome">Nome</label>
              <Field name="name" type="text" class="form-control" />
              <ErrorMessage name="name" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <Field name="email" type="email" class="form-control" />
              <ErrorMessage name="email" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <Field name="password" type="password" class="form-control" />
              <ErrorMessage name="password" class="error-feedback" />
            </div>
  
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                <span
                  v-show="loading"
                  class="spinner-border spinner-border-sm"
                ></span>
                Registrar
              </button>
            </div>
          </div>
        </Form>
  
        <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { computed, onMounted, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from 'vue-router';

const schema = yup.object().shape({
    name: yup
      .string()
      .required("Nome é Obrigatorio!")
      .min(3, "Precisa ser maior que 3 caracteres!")
      .max(100, "Precisa ser no maximo 100 caracteres!"),
    email: yup
      .string()
      .required("Email é Obrigatorio!")
      .email("Email é invalido!")
      .max(100, "Precisa ser no maximo 100 caracteres!"),
    password: yup
      .string()
      .required("Senha é Obrigatorio!")
      .min(6, "Precisa ser maior que 6 caracteres!")
      .max(100, "Precisa ser no maximo 100 caracteres!"),
  });
      
let successful = ref(false);
let loading = ref(false);
let message = ref("");
const store = useStore();
const route = useRouter();

const loggedIn = computed(() =>{
  return store.state.auth.status.loggedIn ?? false;
});

onMounted(() =>{
  if (loggedIn.value) {
    route.push({ path: '/user' })
  }
})

function handleRegister(user) {
  message = "";
  successful = false;
  loading = true;

  store.dispatch("auth/register", user).then(
    (data) => {
      console.log(data);
      if (data?.access_token) {
        window.localStorage.setItem('user', JSON.stringify(data));
      }
      message = data.message;
      successful = true;
      loading = false;
      route.push({ path: '/all' });
    },
    (error) => {
      message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      successful = false;
      loading = false;
    }
  );
}
</script>

  

  