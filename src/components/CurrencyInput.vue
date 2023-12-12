<template>
    <div class="form-group">
        <input ref="inputRef" 
          type="text" 
          class="form-control"
          id="preco"
          name="preco" 
        />
    </div>
</template>
  

  <script>
  import { useCurrencyInput } from "vue-currency-input";
  import { watch } from 'vue'

  export default {
    name: "CurrencyInput",
    props: {
      modelValue: Number,
      options: Object,
    },
    setup(props) {
      const { inputRef, setOptions, setValue } = useCurrencyInput(props.options)

      watch(
        () => props.modelValue, // Vue 2: props.value
        (value) => {
          setValue(value)
        }
      )

      watch(
        () => props.options,
        (options) => {
          setOptions(options)
        }
      )

      return { inputRef }
    },
  };
  </script>
  