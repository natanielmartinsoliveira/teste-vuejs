<template>
  <div>
    <input type="file" @change="uploadFile" accept="image/png, image/gif, image/jpeg" />
  </div>
</template>

<script setup>
  import { ref, computed, watch, defineProps, defineEmits } from "vue";
  import axios from "axios";
  import authHeader from '../services/auth-header';

  const file = ref(null);

  const fileName = computed(() => file.value?.name);
  const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
  const fileMimeType = computed(() => file.value?.type);

  const props = defineProps({
      modelValue: String
  });

  const emit = defineEmits(['update:modelValue'])

  watch(() => props.modelValue, (value) => {
    emit('update:modelValue', value);
  });
 
  const uploadFile = async (event) => {
    file.value = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file.value);
    reader.onload = async () => {

      const encodedFile = reader.result.split(",")[1];
      const data = {
        file: encodedFile,
        fileName: fileName.value,
        fileExtension: fileExtension.value,
        fileMimeType: fileMimeType.value,
      };
      
      try {
        const endpoint = "http://localhost:8082/api/upload";
        const response = await axios.post(endpoint, data, { headers: authHeader() });
        emit('update:modelValue', response.data.filename);
      } catch (error) {
        console.error(error);
      }
    };

  };

</script>