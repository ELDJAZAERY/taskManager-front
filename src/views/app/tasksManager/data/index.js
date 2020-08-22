const data = [
  {
    category: "Web",
    createdAt: "2020-08-22T16:14:57.777Z",
    deadline: "2020-08-19T23:00:00.000Z",
    description: "sqdqsdkjn",
    id: "1a013b0f-c4b3-401c-9f76-4025244d0370",
    priority: "Normal",
    profile: "DEVELOPER",
    status: "In Backlog",
    title: "task",
    updatedAt: "2020-08-22T16:14:57.777Z",
  },
  {
    id: "uuid-2",
    status: "In Progress",
    title: "Some Title",
    category: "Web",
    priority: "Normal",
    createdAt: new Date(),
    deadline: new Date(),
    description: " some description ................................... ",
  },
  {
    id: "uuid-3",
    status: "In Review",
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
    status: "In Backlog",
    icon: "⭕️",
    color: "#EB5A46",
  },
  {
    status: "In Progress",
    icon: "🔆️",
    color: "#00C2E0",
  },
  {
    status: "In Review",
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
  { label: "Data Visualization", value: "Data_Visualization", key: 3 },
  { label: "Data Analyse", value: "Data_Analyse", key: 4 },
  { label: "Audit", value: "Audit", key: 5 },
  { label: "Finance", value: "Finance", key: 6 },
  { label: "Other", value: "Other", key: 7 },
];

const PRIORITIES = [
  { label: "Low", value: "Low", key: 0 },
  { label: "Normal", value: "Normal", key: 1 },
  { label: "High", value: "High", key: 2 },
];

export { statuses, CATEGORIES, PRIORITIES };
