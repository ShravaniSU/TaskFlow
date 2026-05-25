import { Request, Response, NextFunction } from 'express';
import todoService from '../services/todo.service.js';
import AppError from '../utils/errors.js';

export const getAllTodosHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todos = await todoService.getAllTodos(req.query);
    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: { todos },
    });
  } catch (error) {
    next(error);
  }
};

export const getTodoByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const todo = await todoService.getTodoById(id);
    if (!todo) {
      return next(new AppError('Todo not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

export const createTodoHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({
      status: 'success',
      data: { todo },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodoHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const todo = await todoService.updateTodo(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { todo },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError('Todo not found', 404));
    }
    next(error);
  }
};

export const deleteTodoHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await todoService.deleteTodo(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError('Todo not found', 404));
    }
    next(error);
  }
};

export const getTodoStatsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await todoService.getTodoStats();
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTodosHandler,
  getTodoByIdHandler,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
  getTodoStatsHandler,
};
