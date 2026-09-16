// Initial Seed Data for Online Learning Management System

export const INITIAL_COURSES = [
  {
    id: 1,
    title: "Mastering React 19 & Next.js 15 Full-Stack",
    instructor: "Dr. Sarah Jenkins",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    category: "Web Development",
    duration: "34 Hours",
    level: "Intermediate",
    price: 69.99,
    description: "Deep dive into React 19 features including Server Components, Actions, useOptimistic, and build production applications with Next.js 15 App Router.",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 3420,
    modules: [
      "Introduction to Modern React 19 Features",
      "React Server Components & Server Actions",
      "Next.js 15 Routing, Cache and Data Fetching",
      "Authentication with Auth.js & Role Management",
      "Full-Stack Deployment & Performance Optimization"
    ]
  },
  {
    id: 2,
    title: "Complete Python for Data Science and Machine Learning",
    instructor: "Prof. Michael Chen",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    category: "Data Science",
    duration: "42 Hours",
    level: "Beginner",
    price: 79.99,
    description: "Master Python programming from scratch. Learn NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, and build end-to-end predictive machine learning models.",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 5210,
    modules: [
      "Python Basics and Data Structures",
      "Data Analysis with Pandas and NumPy",
      "Data Visualization with Seaborn and Plotly",
      "Supervised Machine Learning Algorithms",
      "Capstone Project: Real Estate Price Predictor"
    ]
  },
  {
    id: 3,
    title: "Modern UI/UX Design with Figma: Concept to Prototype",
    instructor: "Elena Rostova",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    category: "UI/UX Design",
    duration: "22 Hours",
    level: "Beginner",
    price: 49.99,
    description: "Learn design thinking, typography, wireframing, component systems, auto-layout, interactive prototyping, and handoff workflows in modern Figma.",
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 2890,
    modules: [
      "Design Systems and Color Theory",
      "Wireframing & Information Architecture",
      "Figma Auto Layout and Component Variants",
      "Micro-Interactions and Advanced Prototyping",
      "Design Critique & Developer Handoff"
    ]
  },
  {
    id: 4,
    title: "Cloud Computing & DevOps with AWS, Docker & Kubernetes",
    instructor: "David Miller",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    category: "Cloud & DevOps",
    duration: "38 Hours",
    level: "Advanced",
    price: 89.99,
    description: "Architect scalable cloud solutions on AWS. Containerize microservices with Docker, manage clusters with Kubernetes, and automate CI/CD with GitHub Actions.",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 1950,
    modules: [
      "AWS Core Services: EC2, S3, RDS, VPC",
      "Docker Containerization Best Practices",
      "Kubernetes Cluster Orchestration & Helm",
      "Continuous Integration & CD Pipelines",
      "Monitoring with Prometheus and Grafana"
    ]
  },
  {
    id: 5,
    title: "Cross-Platform Mobile App Development with Flutter & Dart",
    instructor: "Sophia Rodriguez",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    category: "Mobile Development",
    duration: "29 Hours",
    level: "Intermediate",
    price: 59.99,
    description: "Build beautiful, native iOS and Android apps from a single codebase using Flutter and Dart. Master state management with Riverpod and Firebase integration.",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 2410,
    modules: [
      "Dart Fundamentals & Object-Oriented Principles",
      "Flutter UI Layouts and Responsive Widgets",
      "State Management with Riverpod",
      "RESTful API & Firebase Cloud Store Integration",
      "App Store & Google Play Publishing"
    ]
  },
  {
    id: 6,
    title: "Deep Learning, LLMs & Generative AI Bootcamp",
    instructor: "Dr. Alan Vance",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    category: "Artificial Intelligence",
    duration: "45 Hours",
    level: "Advanced",
    price: 99.99,
    description: "Explore Transformers, PyTorch, LangChain, vector databases, RAG architecture, and fine-tuning open-source LLMs to build intelligent AI agents.",
    rating: 4.95,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 4100,
    modules: [
      "Neural Networks & Deep Learning Foundations",
      "Convolutional & Recurrent Architectures",
      "Transformer Architecture Explained",
      "Retrieval Augmented Generation (RAG) Systems",
      "Fine-Tuning Llama 3 & Agentic Workflows"
    ]
  },
  {
    id: 7,
    title: "Full-Stack Web Development Bootcamp with MERN",
    instructor: "James Wilson",
    instructorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    category: "Web Development",
    duration: "50 Hours",
    level: "Beginner",
    price: 74.99,
    description: "The complete web development course covering HTML5, CSS3, Modern JavaScript, Node.js, Express, MongoDB, and React with real-world projects.",
    rating: 4.75,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 6840,
    modules: [
      "Frontend Foundation: HTML, CSS & Modern JS",
      "React Essentials & State Management",
      "Node.js & Express REST API Development",
      "MongoDB & Mongoose Schema Design",
      "Deploying Full-Stack Applications to Render & Vercel"
    ]
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals & Ethical Hacking",
    instructor: "Marcus Stone",
    instructorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    category: "Cloud & DevOps",
    duration: "28 Hours",
    level: "Intermediate",
    price: 64.99,
    description: "Learn network security, penetration testing methodologies, vulnerability assessments, Wireshark packet analysis, and ethical defense strategies.",
    rating: 4.82,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    enrolledStudents: 1820,
    modules: [
      "Networking Protocols & Vulnerability Scanning",
      "Penetration Testing Tools: Nmap & Metasploit",
      "Web Application Security (OWASP Top 10)",
      "Wireless Network Security & Cryptography",
      "Incident Response and Threat Intelligence"
    ]
  }
];

export const CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Cloud & DevOps",
  "Mobile Development",
  "Artificial Intelligence"
];

export const COURSE_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export const UPCOMING_CLASSES = [
  {
    id: 101,
    title: "React 19 Server Actions & Optimistic UI Q&A",
    instructor: "Dr. Sarah Jenkins",
    date: "Today",
    time: "02:00 PM - 03:30 PM",
    badge: "Live Workshop",
    zoomLink: "https://zoom.us/j/example1"
  },
  {
    id: 102,
    title: "Pandas & Exploratory Data Analysis Hands-on",
    instructor: "Prof. Michael Chen",
    date: "Tomorrow",
    time: "10:30 AM - 12:00 PM",
    badge: "Interactive Lab",
    zoomLink: "https://zoom.us/j/example2"
  },
  {
    id: 103,
    title: "Designing Design Systems in Figma",
    instructor: "Elena Rostova",
    date: "Sep 19",
    time: "04:00 PM - 05:30 PM",
    badge: "Design Critique",
    zoomLink: "https://zoom.us/j/example3"
  },
  {
    id: 104,
    title: "Deploying Multi-Tier K8s Clusters on AWS",
    instructor: "David Miller",
    date: "Sep 21",
    time: "06:00 PM - 07:30 PM",
    badge: "Live Demo",
    zoomLink: "https://zoom.us/j/example4"
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: 201,
    user: "You",
    action: "Completed Module 3 Quiz with a score of 95%",
    course: "Mastering React 19 & Next.js 15",
    time: "25 minutes ago",
    type: "quiz"
  },
  {
    id: 202,
    user: "You",
    action: "Submitted Capstone Project for peer review",
    course: "Modern UI/UX Design with Figma",
    time: "3 hours ago",
    type: "submission"
  },
  {
    id: 203,
    user: "Prof. Michael Chen",
    action: "Posted new assignment: Supervised Learning Analysis",
    course: "Complete Python for Data Science",
    time: "Yesterday at 4:15 PM",
    type: "assignment"
  },
  {
    id: 204,
    user: "System",
    action: "Earned Certificate of Completion in HTML5 & CSS3 Masterclass",
    course: "Full-Stack Web Development Bootcamp",
    time: "2 days ago",
    type: "certificate"
  }
];

export const DEFAULT_USERS = [
  {
    id: "usr_admin",
    name: "Dr. Sarah Jenkins",
    email: "instructor@lms.com",
    password: "password123",
    role: "Instructor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_student",
    name: "Alex Morgan",
    email: "student@lms.com",
    password: "password123",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  }
];
