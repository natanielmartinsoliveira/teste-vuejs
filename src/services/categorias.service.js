import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082';

class CategoriasService {
  getCategoriasPage() {
    return axios.get(API_URL + `/api/categorias`, { headers: authHeader() });
  }

}

export default new CategoriasService();
