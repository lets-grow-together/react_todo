import axios from 'axios';

const axi = axios.create({
  baseURL: 'https://react-todo-mvc2.firebaseio.com/todos/',
  timeout: 1000
});

export const getTodos = () => axi.get('/.json');
