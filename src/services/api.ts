import axios from 'axios';

export const api = axios.create({
   baseURL: 'http://localhost:3333/'
})

/* O axios é uma biblioteca para fazer requisições HTTP que trás funcionalidades
 * que não encontramos no fetch(). Por exemplo definir uma URL base, cuja qual
 * estará presente em toda a aplicação, estando presente em todas as chamadas da
 * API.
 */