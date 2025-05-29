type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: number;
};

const FocusTasks = () => {
  // States & Types to prepare -> this sets up a list of tasks with their type & new task input
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Data persistence -> Load & Save tasks to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("focus_tasks");
    if (saved) {
      setTasks(JSON.parse(saved)); // Parse the JSON string back into an array of tasks
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus_tasks", JSON.stringify(tasks)); // JSON.stringify ->  it converts the array of tasks into a JSON string
  }, [tasks]);

  // Core Features Logic, Toggle
  const toggleTaskDone = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      );
      localStorage.setItem("focus_tasks", JSON.stringify(updated));
      return updated;
    });
  };

  // UI Structure (JSX)
  return (
    <div>
      <h2>Focus Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key = {task.id}
            className={`p-2 rounded-lg flex items-center justify content-between cursor-pointer transition-all ${
                task.isDone ? "bg-green-100 text-green-700 line-through" : "bg-white text-gray-800"
            }`}
          
          >
            <span className="text-lg">{task.title}</span>
            <span className="text-lg">{task.isDone ? "✅" : "🕒"}</span>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default FocusTasks;
