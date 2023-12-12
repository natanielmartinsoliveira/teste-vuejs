import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082';

class ProdutosService {
  getProdutosPage(page) {
    return axios.get(API_URL + `/api/produtos?page=`+ page, { headers: authHeader() });
  }

  getProdutosId(id) {
    return axios.get(API_URL + `/api/produto/${id}`, { headers: authHeader() });
  }

  getCreateSave(produtos) {
    return axios.post(API_URL + `/api/produto`, produtos, { headers: authHeader() });
  }

  getEditSave(id, produtos) {
    return axios.put(API_URL + `/api/produto/${id}`, produtos, { headers: authHeader() });
  }

  getDelete(id) {
    return axios.delete(API_URL + `/api/produto/${id}`, { headers: authHeader() });
  }
}

export default new ProdutosService();
