import { Status, Priority } from '@prisma/client';
import prisma, { pool } from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.todo.deleteMany({});
  console.log('🗑️ Existing todos deleted.');

  const now = new Date();

  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(now.getDate() - days);
    return d;
  };

  const daysFromNow = (days: number) => {
    const d = new Date();
    d.setDate(now.getDate() + days);
    return d;
  };

  const todos = [
    {
      title: 'Complete Project Architecture Proposal',
      description: 'Write up technical specifications, database schema, and infrastructure blueprints for TaskFlow.',
      status: 'completed' as Status,
      priority: 'high' as Priority,
      category: 'Work',
      dueDate: daysAgo(2),
    },
    {
      title: 'Design TaskFlow User Interface',
      description: 'Create Figma designs for Dashboard, Tasks view, and Settings with a clean glassmorphism aesthetic.',
      status: 'in_progress' as Status,
      priority: 'high' as Priority,
      category: 'Work',
      dueDate: daysFromNow(1),
    },
    {
      title: 'Initialize Express Backend API',
      description: 'Set up Node.js with TypeScript, Express, Helmet, CORS, and Prisma ORM wrapper.',
      status: 'in_progress' as Status,
      priority: 'medium' as Priority,
      category: 'Work',
      dueDate: daysFromNow(3),
    },
    {
      title: 'Implement Database Migrations',
      description: 'Define the SQL schemas for todos and set up Postgres container.',
      status: 'pending' as Status,
      priority: 'medium' as Priority,
      category: 'Work',
      dueDate: daysFromNow(4),
    },
    {
      title: 'Weekly Grocery Shopping',
      description: 'Buy fresh vegetables, milk, eggs, chicken breast, and whole wheat bread.',
      status: 'completed' as Status,
      priority: 'low' as Priority,
      category: 'Personal',
      dueDate: daysAgo(1),
    },
    {
      title: 'Gym Workout - Legs Day',
      description: 'Squats, Romanian deadlifts, leg press, and calf raises. Stretch for 10 minutes.',
      status: 'completed' as Status,
      priority: 'medium' as Priority,
      category: 'Health',
      dueDate: daysAgo(3),
    },
    {
      title: 'Annual Physical Examination',
      description: 'Visit Dr. Jenkins for the annual wellness checkup and blood tests.',
      status: 'pending' as Status,
      priority: 'high' as Priority,
      category: 'Health',
      dueDate: daysFromNow(10),
    },
    {
      title: 'Read 2 Chapters of Clean Code',
      description: 'Chapters on Meaningful Names and Functions. Take notes on key rules.',
      status: 'in_progress' as Status,
      priority: 'low' as Priority,
      category: 'Learning',
      dueDate: daysFromNow(2),
    },
    {
      title: 'Learn Docker Containers',
      description: 'Understand containerization basics, multi-stage builds, and Docker Compose networking.',
      status: 'pending' as Status,
      priority: 'high' as Priority,
      category: 'Learning',
      dueDate: daysFromNow(5),
    },
    {
      title: 'Review Monthly Budget',
      description: 'Allocate savings, track expenses, and plan investments for the upcoming month.',
      status: 'completed' as Status,
      priority: 'high' as Priority,
      category: 'Finance',
      dueDate: daysAgo(5),
    },
    {
      title: 'Pay Credit Card Bill',
      description: 'Pay the outstanding amount before the due date to avoid interest charges.',
      status: 'pending' as Status,
      priority: 'high' as Priority,
      category: 'Finance',
      dueDate: daysAgo(1),
    },
    {
      title: 'Walk the dog',
      description: 'Take Max for a walk in the local park for 30 minutes in the evening.',
      status: 'pending' as Status,
      priority: 'low' as Priority,
      category: 'Personal',
      dueDate: daysAgo(2),
    },
    {
      title: 'Schedule dentist appointment',
      description: 'Call the dental clinic to book a routine cleaning session.',
      status: 'pending' as Status,
      priority: 'medium' as Priority,
      category: 'Health',
      dueDate: daysFromNow(7),
    },
    {
      title: 'Buy Birthday Gift for Mom',
      description: 'Find a premium quality scarf or custom jewelry that she would love.',
      status: 'pending' as Status,
      priority: 'medium' as Priority,
      category: 'Personal',
      dueDate: daysFromNow(12),
    },
    {
      title: 'Optimize Database Indexing',
      description: 'Create indices on status, priority, and category fields to speed up searches.',
      status: 'pending' as Status,
      priority: 'low' as Priority,
      category: 'Work',
      dueDate: daysFromNow(15),
    },
  ];

  for (const todo of todos) {
    await prisma.todo.create({
      data: todo,
    });
  }

  console.log(`✅ Database successfully seeded with ${todos.length} todos.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
