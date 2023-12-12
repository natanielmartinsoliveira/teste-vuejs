import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'produtos');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  
}

export default new UserService();
