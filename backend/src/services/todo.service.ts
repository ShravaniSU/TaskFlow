import prisma from '../lib/prisma.js';
import { Status, Priority } from '@prisma/client';

export interface QueryOptions {
  status?: Status;
  priority?: Priority;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getAllTodos = async (options: QueryOptions) => {
  const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  const where: any = {};

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (category) where.category = category;
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.todo.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
};

export const getTodoById = async (id: string) => {
  return prisma.todo.findUnique({
    where: { id },
  });
};

export const createTodo = async (data: {
  title: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  category?: string | null;
  dueDate?: Date | null;
}) => {
  return prisma.todo.create({
    data,
  });
};

export const updateTodo = async (
  id: string,
  data: {
    title?: string;
    description?: string | null;
    status?: Status;
    priority?: Priority;
    category?: string | null;
    dueDate?: Date | null;
  }
) => {
  return prisma.todo.update({
    where: { id },
    data,
  });
};

export const deleteTodo = async (id: string) => {
  return prisma.todo.delete({
    where: { id },
  });
};

export const getTodoStats = async () => {
  const now = new Date();

  const [total, completed, pending, inProgress, overdue] = await Promise.all([
    prisma.todo.count(),
    prisma.todo.count({ where: { status: 'completed' } }),
    prisma.todo.count({ where: { status: 'pending' } }),
    prisma.todo.count({ where: { status: 'in_progress' } }),
    prisma.todo.count({
      where: {
        status: { in: ['pending', 'in_progress'] },
        dueDate: { lt: now },
      },
    }),
  ]);

  // Let's also retrieve tasks count by priority and category for charts
  const priorityStats = await prisma.todo.groupBy({
    by: ['priority'],
    _count: {
      _all: true,
    },
  });

  const categoryStats = await prisma.todo.groupBy({
    by: ['category'],
    where: {
      category: { not: null },
    },
    _count: {
      _all: true,
    },
  });

  return {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    priorityStats: priorityStats.map((item) => ({
      priority: item.priority,
      count: item._count._all,
    })),
    categoryStats: categoryStats.map((item) => ({
      category: item.category,
      count: item._count._all,
    })),
  };
};
export default {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats,
};
