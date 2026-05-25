import { Router } from 'express';
import {
  getAllTodosHandler,
  getTodoByIdHandler,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
  getTodoStatsHandler,
} from '../controllers/todo.controller.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  createTodoSchema,
  updateTodoSchema,
  queryTodoSchema,
  getTodoByIdSchema,
} from '../validators/todo.validator.js';

const router = Router();

router.get('/stats', getTodoStatsHandler);

router
  .route('/')
  .get(validateRequest(queryTodoSchema), getAllTodosHandler)
  .post(validateRequest(createTodoSchema), createTodoHandler);

router
  .route('/:id')
  .get(validateRequest(getTodoByIdSchema), getTodoByIdHandler)
  .put(validateRequest(updateTodoSchema), updateTodoHandler)
  .delete(validateRequest(getTodoByIdSchema), deleteTodoHandler);

export default router;
