import axios from 'axios';

const axi = axios.create({
  baseURL: 'https://react-todo-mvc2.firebaseio.com/todos/',
  timeout: 1000
});

export const getTodos = () => axi.get('/.json');

export const insertTodo = text => axi.post('/.json', { text, isDone: false });

export const deleteTodo = id => axi.delete(`/${id}/.json`);