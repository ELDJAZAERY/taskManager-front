const data = [
  {
    id: "uuid-1",
    status: "Backlog",
    title: "Some Title",
    category: "Web",
    priority: "Normal",
    createdAt: new Date(),
    deadline: new Date(),
    description: " some description ................................... ",
  },
  {
    id: "uuid-2",
    status: "In progress",
    title: "Some Title",
    category: "Web",
    priority: "Normal",
    createdAt: new Date(),
    deadline: new Date(),
    description: " some description ................................... ",
  },
  {
    id: "uuid-3",
    status: "In review",
    title: "Some Title",
    category: "Web",
    priority: "Normal",
    createdAt: new Date(),
    deadline: new Date(),
    description: " some description ................................... ",
  },
  {
    id: "uuid-4",
    status: "Done",
    title: "Some Title",
    category: "Web",
    priority: "Normal",
    createdAt: new Date(),
    deadline: new Date(),
    description: " some description ................................... ",
  },
];

const statuses = [
  {
    status: "Backlog",
    icon: "⭕️",
    color: "#EB5A46",
  },
  {
    status: "In progress",
    icon: "🔆️",
    color: "#00C2E0",
  },
  {
    status: "In review",
    icon: "📝",
    color: "#C377E0",
  },
  {
    status: "Done",
    icon: "✅",
    color: "#3981DE",
  },
];

const CATEGORIES = [
  { label: "Design", value: "Design", key: 0 },
  { label: "Web", value: "Web", key: 1 },
  { label: "Mobile", value: "Mobile", key: 2 },
  { label: "Data", value: "Data", key: 3 },
  { label: "Audit", value: "Audit", key: 4 },
  { label: "Finance", value: "Finance", key: 5 },
];

const PRIORITIES = [
    { label: "Low", value: "Low", key: 0 },
    { label: "Normal", value: "Normal", key: 1 },
    { label: "High", value: "High", key: 2 },  
];

export { data, statuses, CATEGORIES, PRIORITIES };
