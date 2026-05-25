import { z } from 'zod';

const statusEnum = z.enum(['pending', 'in_progress', 'completed']);
const priorityEnum = z.enum(['low', 'medium', 'high']);

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    description: z.string().optional().nullable(),
    status: statusEnum.default('pending'),
    priority: priorityEnum.default('medium'),
    category: z.string().optional().nullable(),
    dueDate: z.preprocess(
      (val) => (typeof val === 'string' && val ? new Date(val) : val),
      z.date().optional().nullable()
    ).optional(),
  }),
});

export const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(255, 'Title is too long').optional(),
    description: z.string().optional().nullable(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    category: z.string().optional().nullable(),
    dueDate: z.preprocess(
      (val) => (typeof val === 'string' && val ? new Date(val) : val),
      z.date().optional().nullable()
    ).optional(),
  }),
});

export const queryTodoSchema = z.object({
  query: z.object({
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const getTodoByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
});
export default {
  createTodoSchema,
  updateTodoSchema,
  queryTodoSchema,
  getTodoByIdSchema,
};
