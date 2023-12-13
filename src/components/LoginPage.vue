<template>
    <div class="col-md-12">
      <div class="card card-container">
        <Form @submit="handleLogin" :validation-schema="schema">
          <div class="form-group">
            <label for="username">Email</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
  
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span>Entrar</span>
            </button>
          </div>
  
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
        </Form>
      </div>
    </div>
  </template>
<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { computed, onMounted, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter } from 'vue-router';

const schema = yup.object().shape({
    username: yup.string().required("Username is required!"),
    password: yup.string().required("Password is required!"),
  });

let loading = ref();
let message = ref('');
const store = useStore();
const route = useRouter();

const loggedIn = computed(() =>{
  return store.state.auth.status.loggedIn;
});

onMounted(() =>{
  if (loggedIn.value) {
    route.push({ path: '/' })
  }
})

function handleLogin(user) {
  loading = true;

  store.dispatch("auth/login", user).then(
    () => {
      route.push({ path: '/all' })
    },
    (error) => {
      loading = false;
      message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
    }
  );
}

</script>
