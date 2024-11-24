'use client';

import { useState } from 'react';
import styles from './TodoList.module.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  timestamp: Date;
}

type GroupedTodos = {
  [key: string]: Todo[];
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && dateInput && timeInput) {
      const timestamp = new Date(`${dateInput}T${timeInput}`);
      const newTodo: Todo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        timestamp
      };
      setTodos(prev => [...prev, newTodo]);
      setInput('');
      setDateInput('');
      setTimeInput('');
    }
  };

  const handleToggle = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const groupTodosByDay = () => {
    const groups: GroupedTodos = {};
    todos.forEach(todo => {
      const dateKey = formatDate(todo.timestamp);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(todo);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });

    return groups;
  };

  const groupedTodos = groupTodosByDay();

  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <div className={styles.paperLines} />
        <div className={styles.marginLine} />
        
        <div className={styles.content}>
          <h1 className={styles.title}>To do List</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tambah tugas baru..."
                className={`${styles.input} ${styles.textInput}`}
              />
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className={`${styles.input} ${styles.dateInput}`}
                required
              />
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className={`${styles.input} ${styles.timeInput}`}
                required
              />
              <button type="submit" className={styles.button}>
                Tambah
              </button>
            </div>
          </form>

          <div className={styles.todoSection}>
            {Object.entries(groupedTodos).map(([day, dayTodos]) => (
              <div key={day}>
                <h2 className={styles.dayTitle}>{day}</h2>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableCell}>Waktu</th>
                      <th className={styles.tableCell}>Tugas</th>
                      <th className={styles.tableCell}>Status</th>
                      <th className={styles.tableCell}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayTodos.map((todo) => (
                      <tr key={todo.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{formatTime(todo.timestamp)}</td>
                        <td className={styles.tableCell}>
                          <span className={todo.completed ? styles.completed : ''}>
                            {todo.text}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo.id)}
                            className={styles.checkbox}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className={styles.deleteButton}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {Object.keys(groupedTodos).length === 0 && (
              <div className={styles.emptyState}>
                Belum ada tugas yang dijadwalkan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}