import api from './axios.js';
import type { Todo, TodoStats, Status, Priority } from '../types/index.js';

export interface GetTodosParams {
  status?: Status;
  priority?: Priority;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getTodos = async (params?: GetTodosParams): Promise<Todo[]> => {
  const response = await api.get('/todos', { params });
  return response.data.data.todos;
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await api.get(`/todos/${id}`);
  return response.data.data.todo;
};

export const createTodo = async (todo: {
  title: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  category?: string | null;
  dueDate?: string | null;
}): Promise<Todo> => {
  const response = await api.post('/todos', todo);
  return response.data.data.todo;
};

export const updateTodo = async (params: {
  id: string;
  todo: Partial<{
    title: string;
    description: string | null;
    status: Status;
    priority: Priority;
    category: string | null;
    dueDate: string | null;
  }>;
}): Promise<Todo> => {
  const response = await api.put(`/todos/${params.id}`, params.todo);
  return response.data.data.todo;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const getTodoStats = async (): Promise<TodoStats> => {
  const response = await api.get('/todos/stats');
  return response.data.data.stats;
};
