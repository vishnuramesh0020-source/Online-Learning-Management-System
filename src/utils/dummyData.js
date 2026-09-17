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
    id: "usr_instructor",
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
  },
  {
    id: "usr_educationpro",
    name: "Education Pro Student",
    email: "example.educationpro@gmail.com",
    password: "password123",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu_1",
    fullName: "Alex Morgan",
    email: "alex.morgan@educationpro.com",
    phone: "+91 98765 43210",
    address: "42 Richmond Road, Bangalore, Karnataka 560025",
    qualification: "B.Tech in Computer Science",
    enrollmentDate: "2026-08-10",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_2",
    fullName: "Priya Sundaram",
    email: "priya.sundaram@gmail.com",
    phone: "+91 98451 23456",
    address: "15 Anna Nagar 2nd Avenue, Chennai, Tamil Nadu 600040",
    qualification: "M.Sc Data Science & AI",
    enrollmentDate: "2026-08-15",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_3",
    fullName: "Rohan Varma",
    email: "rohan.varma@outlook.com",
    phone: "+91 97112 88491",
    address: "B-204 Green Valley, Cyber City, Gurgaon, Haryana 122002",
    qualification: "Bachelor of Computer Applications (BCA)",
    enrollmentDate: "2026-08-22",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_4",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@yahoo.com",
    phone: "+91 94432 10987",
    address: "78 Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033",
    qualification: "B.Des in UI/UX Interaction Design",
    enrollmentDate: "2026-09-01",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_5",
    fullName: "Devraj Mukherjee",
    email: "devraj.mukherjee@gmail.com",
    phone: "+91 98300 76543",
    address: "12 Salt Lake Sector V, Kolkata, West Bengal 700091",
    qualification: "B.Sc Information Technology",
    enrollmentDate: "2026-09-05",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_6",
    fullName: "Kavya Nair",
    email: "kavya.nair@hotmail.com",
    phone: "+91 99887 65432",
    address: "305 Marine Drive, Nariman Point, Mumbai, Maharashtra 400021",
    qualification: "Master of Computer Applications (MCA)",
    enrollmentDate: "2026-09-10",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "stu_7",
    fullName: "Aditya Kulkarni",
    email: "aditya.kulkarni@gmail.com",
    phone: "+91 91234 56780",
    address: "88 FC Road, Shivaji Nagar, Pune, Maharashtra 411005",
    qualification: "B.Tech Electronics & Communication",
    enrollmentDate: "2026-09-12",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_INSTRUCTORS = [
  {
    id: "inst_1",
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@educationpro.com",
    experience: "10 Years",
    specialization: "Full-Stack Web Development & Cloud Architecture",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    bio: "Senior Software Architect and PhD in Distributed Systems. Sarah has trained over 15,000 engineers globally in modern React, Next.js, and high-performance server architectures.",
    phone: "+1 (555) 234-5678",
    rating: 4.9,
    assignedCourses: [1]
  },
  {
    id: "inst_2",
    name: "Prof. Michael Chen",
    email: "michael.chen@educationpro.com",
    experience: "12 Years",
    specialization: "Data Science, Machine Learning & Python",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    bio: "Former Principal Data Scientist at Silicon Valley tech giants. Michael specializes in predictive modeling, deep learning architectures, and scalable analytics pipelines with Python.",
    phone: "+1 (555) 345-6789",
    rating: 4.85,
    assignedCourses: [2]
  },
  {
    id: "inst_3",
    name: "Elena Rostova",
    email: "elena.rostova@educationpro.com",
    experience: "8 Years",
    specialization: "UI/UX Design Systems & Interactive Prototyping",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    bio: "Design Lead and international speaker. Elena creates enterprise design tokens, scalable component systems in Figma, and human-centered digital experiences for Fortune 500 apps.",
    phone: "+1 (555) 456-7890",
    rating: 4.8,
    assignedCourses: [3]
  },
  {
    id: "inst_4",
    name: "David Miller",
    email: "david.miller@educationpro.com",
    experience: "14 Years",
    specialization: "DevOps, Kubernetes & AWS Cloud Architecture",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    bio: "Certified AWS Solutions Architect Professional. David designs zero-downtime CI/CD pipelines, Kubernetes orchestrations, and secure multi-region cloud infrastructures.",
    phone: "+1 (555) 567-8901",
    rating: 4.92,
    assignedCourses: [4]
  },
  {
    id: "inst_5",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@educationpro.com",
    experience: "7 Years",
    specialization: "Cross-Platform Mobile Apps with Flutter & Dart",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    bio: "Mobile app developer with over 30 published iOS & Android apps. Expert in reactive state management, offline-first architectures, and smooth 60fps Flutter animations.",
    phone: "+1 (555) 678-9012",
    rating: 4.88,
    assignedCourses: [5]
  },
  {
    id: "inst_6",
    name: "Dr. Alan Vance",
    email: "alan.vance@educationpro.com",
    experience: "15 Years",
    specialization: "Artificial Intelligence, Large Language Models & RAG",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    bio: "Pioneer researcher in neural language modeling and generative AI. Alan guides engineering teams in deploying production-grade LLMs, vector search, and autonomous multi-agent pipelines.",
    phone: "+1 (555) 789-0123",
    rating: 4.96,
    assignedCourses: [6]
  }
];

export const INITIAL_ENROLLMENTS = [
  {
    id: "enr_101",
    studentId: "stu_1",
    studentName: "Alex Morgan",
    studentEmail: "alex.morgan@educationpro.com",
    courseId: 1,
    courseTitle: "Mastering React 19 & Next.js 15 Full-Stack",
    courseThumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    instructor: "Dr. Sarah Jenkins",
    enrollmentDate: "2026-08-12",
    status: "In Progress",
    progress: 65
  },
  {
    id: "enr_102",
    studentId: "stu_1",
    studentName: "Alex Morgan",
    studentEmail: "alex.morgan@educationpro.com",
    courseId: 3,
    courseTitle: "Modern UI/UX Design with Figma: Concept to Prototype",
    courseThumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
    instructor: "Elena Rostova",
    enrollmentDate: "2026-08-18",
    status: "Completed",
    progress: 100
  },
  {
    id: "enr_103",
    studentId: "stu_2",
    studentName: "Priya Sundaram",
    studentEmail: "priya.sundaram@gmail.com",
    courseId: 2,
    courseTitle: "Complete Python for Data Science and Machine Learning",
    courseThumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    instructor: "Prof. Michael Chen",
    enrollmentDate: "2026-08-16",
    status: "In Progress",
    progress: 45
  },
  {
    id: "enr_104",
    studentId: "stu_3",
    studentName: "Rohan Varma",
    studentEmail: "rohan.varma@outlook.com",
    courseId: 1,
    courseTitle: "Mastering React 19 & Next.js 15 Full-Stack",
    courseThumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    instructor: "Dr. Sarah Jenkins",
    enrollmentDate: "2026-08-25",
    status: "In Progress",
    progress: 30
  },
  {
    id: "enr_105",
    studentId: "stu_4",
    studentName: "Ananya Iyer",
    studentEmail: "ananya.iyer@yahoo.com",
    courseId: 3,
    courseTitle: "Modern UI/UX Design with Figma: Concept to Prototype",
    courseThumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
    instructor: "Elena Rostova",
    enrollmentDate: "2026-09-02",
    status: "In Progress",
    progress: 80
  },
  {
    id: "enr_106",
    studentId: "stu_5",
    studentName: "Devraj Mukherjee",
    studentEmail: "devraj.mukherjee@gmail.com",
    courseId: 4,
    courseTitle: "Cloud Computing & DevOps with AWS, Docker & Kubernetes",
    courseThumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
    instructor: "David Miller",
    enrollmentDate: "2026-09-06",
    status: "In Progress",
    progress: 20
  }
];

export const DEFAULT_COURSE_MODULES = [
  "Module 1: Foundations, Tooling & Core Architecture",
  "Module 2: Practical Implementation & Workflow Patterns",
  "Module 3: Advanced Concepts, State & Data Flow",
  "Module 4: Testing, Performance Optimization & Security",
  "Module 5: Real-World Capstone Project & Production Deployment"
];
