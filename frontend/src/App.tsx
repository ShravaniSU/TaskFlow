import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type React from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  LayoutDashboard,
  ListFilter,
  Menu,
  Moon,
  Pencil,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sun,
  Trash2,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  createTodo,
  deleteTodo,
  getTodoStats,
  getTodos,
  updateTodo,
  type GetTodosParams,
} from './api/todos'
import type { Priority, Status, Todo } from './types'
import './App.css'

const statusOptions: Status[] = ['pending', 'in_progress', 'completed']
const priorityOptions: Priority[] = ['low', 'medium', 'high']
const categories = ['Work', 'Personal', 'Health', 'Learning', 'Finance']

const statusLabel: Record<Status, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
}

const priorityLabel: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const chartColors = [
  'var(--chart-cyan)',
  'var(--chart-mint)',
  'var(--chart-amber)',
  'var(--chart-rose)',
  'var(--chart-violet)',
]

type TodoFormState = {
  title: string
  description: string
  status: Status
  priority: Priority
  category: string
  dueDate: string
}

const emptyForm: TodoFormState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  category: 'Work',
  dueDate: '',
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('taskflow-theme') || 'light')

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem('taskflow-theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return { theme, toggleTheme }
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-root min-h-screen bg-stone-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <AppShell
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </div>
  )
}

function AppShell({
  children,
  sidebarOpen,
  setSidebarOpen,
  theme,
  toggleTheme,
}: {
  children: React.ReactNode
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: string
  toggleTheme: () => void
}) {
  const location = useLocation()
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/tasks': 'Tasks',
    '/analytics': 'Analytics',
    '/settings': 'Settings',
  }

  return (
    <div className="flex min-h-screen">
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-white/95 px-5 py-6 shadow-xl shadow-zinc-200/50 transition-transform dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-black/20 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark grid size-10 place-items-center rounded-lg bg-cyan-600 text-white">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="font-display text-xl font-bold">TaskFlow</p>
              <p className="text-xs text-zinc-500">Work planner</p>
            </div>
          </div>
          <button className="icon-button lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-2">
          <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink to="/tasks" icon={<ClipboardList size={18} />} label="Tasks" />
          <SidebarLink to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
          <SidebarLink to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-header sticky top-0 z-20 border-b border-zinc-200 bg-stone-50/90 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="icon-button lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">{titles[location.pathname] || 'TaskFlow'}</h1>
                <p className="hidden text-sm text-zinc-500 sm:block">Plan, prioritize, and keep work moving.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NavLink to="/tasks" className="primary-button hidden sm:inline-flex">
                <Plus size={17} />
                New task
              </NavLink>
              <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  )
}

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'nav-link-active bg-cyan-600 text-white shadow-sm'
            : 'nav-link-idle text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

function Dashboard() {
  const { data: todos = [], isLoading } = useQuery({ queryKey: ['todos'], queryFn: () => getTodos() })
  const { data: stats } = useQuery({ queryKey: ['todo-stats'], queryFn: getTodoStats })
  const recent = todos.slice(0, 5)
  const completion = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0
  const priorityData = priorityOptions.map((priority) => ({
    name: priorityLabel[priority],
    count: todos.filter((todo) => todo.priority === priority).length,
  }))

  if (isLoading) return <PageSkeleton />

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={stats?.total || todos.length} icon={<ClipboardList />} tone="cyan" />
        <StatCard title="Completed" value={stats?.completed || 0} icon={<CheckCircle2 />} tone="emerald" />
        <StatCard title="Pending" value={stats?.pending || 0} icon={<Circle />} tone="amber" />
        <StatCard title="Overdue" value={stats?.overdue || 0} icon={<AlertCircle />} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title">Completion</h2>
            <Activity className="text-cyan-600" size={20} />
          </div>
          <div className="flex items-end gap-5">
            <div className="relative grid size-36 place-items-center rounded-full bg-conic" style={{ '--progress': `${completion}%` } as React.CSSProperties}>
              <div className="completion-center grid size-28 place-items-center rounded-full bg-white dark:bg-zinc-950">
                <span className="text-3xl font-bold">{completion}%</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-500">Completed tasks out of total active work.</p>
              <div className="progress-track mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="progress-fill h-full rounded-full bg-cyan-600" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title mb-5">Tasks by priority</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--chart-cyan)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="section-title mb-4">Recent tasks</h2>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {recent.length ? recent.map((todo) => <CompactTask key={todo.id} todo={todo} />) : <EmptyState title="No tasks yet" />}
        </div>
      </section>
    </motion.div>
  )
}

function Tasks() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<GetTodosParams>({ sortBy: 'createdAt', sortOrder: 'desc' })
  const [editing, setEditing] = useState<Todo | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(cleanFilters(filters)),
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] })
    },
    onError: () => toast.error('Could not update task'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      toast.success('Task deleted')
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] })
    },
    onError: () => toast.error('Could not delete task'),
  })

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="panel">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="section-title">Task board</h2>
            <p className="text-sm text-zinc-500">Filter, sort, create, update, and clear tasks.</p>
          </div>
          <button
            className="primary-button w-full justify-center sm:w-auto"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={18} />
            Create task
          </button>
        </div>
        <TodoFilters filters={filters} setFilters={setFilters} />
      </section>

      {isLoading ? (
        <PageSkeleton />
      ) : todos.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={() =>
                updateMutation.mutate({
                  id: todo.id,
                  todo: { status: todo.status === 'completed' ? 'pending' : 'completed' },
                })
              }
              onEdit={() => {
                setEditing(todo)
                setFormOpen(true)
              }}
              onDelete={() => {
                if (window.confirm(`Delete "${todo.title}"?`)) deleteMutation.mutate(todo.id)
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No matching tasks" description="Adjust the filters or add a new task." />
      )}

      <AnimatePresence>
        {formOpen && (
          <TodoModal
            todo={editing}
            onClose={() => setFormOpen(false)}
            onDone={() => {
              setFormOpen(false)
              setEditing(null)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TodoFilters({
  filters,
  setFilters,
}: {
  filters: GetTodosParams
  setFilters: (filters: GetTodosParams) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(5,1fr)]">
      <label className="field with-icon">
        <Search size={17} />
        <input
          value={filters.search || ''}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          placeholder="Search tasks"
        />
      </label>
      <Select value={filters.status || ''} onChange={(status) => setFilters({ ...filters, status: status as Status })}>
        <option value="">All statuses</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {statusLabel[status]}
          </option>
        ))}
      </Select>
      <Select value={filters.priority || ''} onChange={(priority) => setFilters({ ...filters, priority: priority as Priority })}>
        <option value="">All priorities</option>
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>
            {priorityLabel[priority]}
          </option>
        ))}
      </Select>
      <Select value={filters.category || ''} onChange={(category) => setFilters({ ...filters, category })}>
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      <Select value={filters.sortBy || 'createdAt'} onChange={(sortBy) => setFilters({ ...filters, sortBy })}>
        <option value="createdAt">Date</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due date</option>
      </Select>
      <Select
        value={filters.sortOrder || 'desc'}
        onChange={(sortOrder) => setFilters({ ...filters, sortOrder: sortOrder as 'asc' | 'desc' })}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </Select>
    </div>
  )
}

function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: {
  todo: Todo
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.article layout className="card group" whileHover={{ y: -2 }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <button className="mt-1 text-cyan-600" onClick={onToggle} aria-label="Toggle complete">
          {todo.status === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold">{todo.title}</h3>
          {todo.description && <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{todo.description}</p>}
        </div>
        <div className="flex opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button className="icon-button" onClick={onEdit} aria-label="Edit task">
            <Pencil size={16} />
          </button>
          <button className="icon-button text-rose-600" onClick={onDelete} aria-label="Delete task">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone={todo.status}>{statusLabel[todo.status]}</Badge>
        <Badge tone={todo.priority}>{priorityLabel[todo.priority]}</Badge>
        {todo.category && <Badge tone="neutral">{todo.category}</Badge>}
      </div>
      {todo.dueDate && (
        <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <Calendar size={15} />
          {formatDate(todo.dueDate)}
        </p>
      )}
    </motion.article>
  )
}

function TodoModal({ todo, onClose, onDone }: { todo: Todo | null; onClose: () => void; onDone: () => void }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<TodoFormState>(() =>
    todo
      ? {
          title: todo.title,
          description: todo.description || '',
          status: todo.status,
          priority: todo.priority,
          category: todo.category || 'Work',
          dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : '',
        }
      : emptyForm,
  )
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        description: form.description || null,
        category: form.category || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      }
      return todo ? updateTodo({ id: todo.id, todo: payload }) : createTodo(payload)
    },
    onMutate: () => toast.loading(todo ? 'Updating task...' : 'Creating task...', { id: 'task-save' }),
    onSuccess: () => {
      toast.success(todo ? 'Task updated' : 'Task created', { id: 'task-save' })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] })
      onDone()
    },
    onError: () => toast.error('Could not save task', { id: 'task-save' }),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={submit}
        className="task-modal w-full max-w-2xl rounded-lg bg-white p-5 shadow-2xl dark:bg-zinc-950"
        initial={{ scale: 0.96, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 18 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">{todo ? 'Edit task' : 'Create task'}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          <label className="form-label">
            Title
            <input className="text-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </label>
          <label className="form-label">
            Description
            <textarea
              className="text-input min-h-28 resize-y"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-label">
              Status
              <Select value={form.status} onChange={(status) => setForm({ ...form, status: status as Status })}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel[status]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="form-label">
              Priority
              <Select value={form.priority} onChange={(priority) => setForm({ ...form, priority: priority as Priority })}>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabel[priority]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="form-label">
              Category
              <Select value={form.category} onChange={(category) => setForm({ ...form, category })}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </label>
            <label className="form-label">
              Due date
              <input
                type="date"
                className="text-input"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </label>
          </div>
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button justify-center" disabled={mutation.isPending}>
            {todo ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

function Analytics() {
  const { data: todos = [], isLoading } = useQuery({ queryKey: ['todos'], queryFn: () => getTodos() })
  const statusData = statusOptions.map((status) => ({ name: statusLabel[status], value: todos.filter((todo) => todo.status === status).length }))
  const priorityData = priorityOptions.map((priority) => ({
    name: priorityLabel[priority],
    count: todos.filter((todo) => todo.priority === priority).length,
  }))
  const categoryData = categories.map((category) => ({ name: category, count: todos.filter((todo) => todo.category === category).length }))
  const trendData = useMemo(() => buildTrend(todos), [todos])

  if (isLoading) return <PageSkeleton />

  return (
    <motion.div className="grid gap-6 xl:grid-cols-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <ChartPanel title="Tasks by status">
        <PieChart>
          <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
            {statusData.map((_, index) => (
              <Cell key={index} fill={chartColors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartPanel>
      <ChartPanel title="Tasks by priority">
        <BarChart data={priorityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="var(--chart-mint)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartPanel>
      <ChartPanel title="Completion trend">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="created" stroke="var(--chart-cyan)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="completed" stroke="var(--chart-mint)" strokeWidth={3} dot={false} />
        </LineChart>
      </ChartPanel>
      <ChartPanel title="Category distribution">
        <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="var(--chart-rose)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ChartPanel>
    </motion.div>
  )
}

function Settings({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <motion.div className="grid gap-6 lg:grid-cols-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="panel">
        <h2 className="section-title mb-4">Appearance</h2>
        <div className="settings-row flex items-center justify-between gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-zinc-500">{theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}</p>
          </div>
          <button className="secondary-button" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            Toggle
          </button>
        </div>
      </section>
      <section className="panel">
        <h2 className="section-title mb-4">App info</h2>
        <dl className="grid gap-3 text-sm">
          <Info label="Version" value="0.1.0" />
          <Info label="Frontend" value="React 19, Vite, Tailwind" />
          <Info label="Backend" value="Express, Prisma, PostgreSQL" />
        </dl>
      </section>
    </motion.div>
  )
}

function NotFound() {
  return <EmptyState title="Page not found" description="Use the sidebar to jump back into TaskFlow." />
}

function StatCard({ title, value, icon, tone }: { title: string; value: number; icon: React.ReactNode; tone: string }) {
  return (
    <section className={`panel stat-card ${tone}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className={`stat-icon ${tone}`}>{icon}</div>
      </div>
    </section>
  )
}

function CompactTask({ todo }: { todo: Todo }) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-medium">{todo.title}</p>
        <p className="text-sm text-zinc-500">{todo.category || 'Uncategorized'}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Badge tone={todo.status}>{statusLabel[todo.status]}</Badge>
        <Badge tone={todo.priority}>{priorityLabel[todo.priority]}</Badge>
      </div>
    </div>
  )
}

function ChartPanel({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="panel chart-panel">
      <h2 className="section-title mb-5">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="field">
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  )
}

function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="panel grid min-h-64 place-items-center text-center">
      <div>
        <div className="empty-icon mx-auto mb-4 grid size-14 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <ListFilter size={26} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="skeleton-tile h-36 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      ))}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

function cleanFilters(filters: GetTodosParams) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')) as GetTodosParams
}

function buildTrend(todos: Todo[]) {
  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return date
  })

  return days.map((date) => {
    const key = date.toISOString().slice(0, 10)
    return {
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      created: todos.filter((todo) => todo.createdAt.slice(0, 10) === key).length,
      completed: todos.filter((todo) => todo.status === 'completed' && todo.updatedAt.slice(0, 10) === key).length,
    }
  })
}

export default App
