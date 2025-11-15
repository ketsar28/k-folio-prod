export const blogArticles = [
  {
    id: 1,
    title: "Getting Started with Machine Learning in 2025",
    slug: "getting-started-machine-learning-2025",
    excerpt:
      "A comprehensive guide for beginners looking to start their journey in machine learning. Learn about the essential tools, libraries, and concepts you need to know.",
    content: `
# Getting Started with Machine Learning in 2025

Machine Learning has become one of the most exciting and rapidly growing fields in technology. Whether you're a complete beginner or transitioning from another field, this guide will help you get started.

## Why Learn Machine Learning?

Machine Learning is transforming industries from healthcare to finance, from autonomous vehicles to recommendation systems. The demand for ML professionals continues to grow, making it an excellent career choice.

## Essential Tools and Libraries

### Python
Python is the go-to language for ML due to its simplicity and powerful libraries.

### Key Libraries:
- **NumPy**: Numerical computing
- **Pandas**: Data manipulation
- **Scikit-learn**: ML algorithms
- **TensorFlow/PyTorch**: Deep learning
- **Matplotlib/Seaborn**: Visualization

## Getting Started

1. **Learn Python Basics**: Master the fundamentals
2. **Understand Statistics**: Essential for ML
3. **Practice with Datasets**: Use Kaggle datasets
4. **Build Projects**: Apply your knowledge
5. **Join Communities**: Learn from others

## Recommended Learning Path

Start with supervised learning algorithms like Linear Regression and Decision Trees. Once comfortable, move to more complex algorithms and eventually deep learning.

Remember: Practice is key!
    `,
    category: "Tutorial",
    tags: ["Machine Learning", "Python", "Beginner", "Guide"],
    author: "Muhammad Ketsar Ali Abi Wahid",
    publishedDate: "2024-11-10",
    readTime: "8 min read",
    image: "blog-ml-getting-started.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Top 10 Python Libraries for Data Science",
    slug: "top-10-python-libraries-data-science",
    excerpt:
      "Discover the most essential Python libraries every data scientist should master. From data manipulation to visualization and machine learning.",
    content: `
# Top 10 Python Libraries for Data Science

Python has become the dominant language in Data Science, and for good reason. Here are the top 10 libraries you need to know.

## 1. NumPy
The foundation of numerical computing in Python. Essential for array operations and mathematical functions.

## 2. Pandas
Your go-to library for data manipulation and analysis. Makes working with structured data intuitive and powerful.

## 3. Matplotlib
The grandfather of Python visualization. Create publication-quality plots and charts.

## 4. Seaborn
Built on Matplotlib, provides beautiful statistical visualizations with less code.

## 5. Scikit-learn
The most popular ML library. Includes everything from preprocessing to model evaluation.

## 6. TensorFlow
Google's deep learning framework. Industry standard for production ML.

## 7. PyTorch
Facebook's deep learning library. Preferred by researchers for its flexibility.

## 8. SciPy
Scientific computing library. Advanced mathematical functions and optimization.

## 9. Plotly
Interactive visualizations and dashboards. Great for exploratory data analysis.

## 10. Statsmodels
Statistical modeling and testing. Essential for hypothesis testing and regression analysis.

## Conclusion

Master these libraries and you'll be well-equipped to tackle any data science challenge!
    `,
    category: "Tools & Libraries",
    tags: ["Python", "Data Science", "Libraries", "Tools"],
    author: "Muhammad Ketsar Ali Abi Wahid",
    publishedDate: "2024-11-05",
    readTime: "6 min read",
    image: "blog-python-libraries.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Understanding Neural Networks: A Visual Guide",
    slug: "understanding-neural-networks-visual-guide",
    excerpt:
      "Demystify neural networks with clear explanations and visual examples. Learn how these powerful models work under the hood.",
    content: `
# Understanding Neural Networks: A Visual Guide

Neural networks are the backbone of modern AI. Let's break down how they work.

## What is a Neural Network?

A neural network is a computational model inspired by the human brain. It consists of layers of interconnected nodes (neurons) that process information.

## Key Components

### 1. Input Layer
Receives the raw data (features).

### 2. Hidden Layers
Process the information through weighted connections.

### 3. Output Layer
Produces the final prediction or classification.

## How Neural Networks Learn

Neural networks learn through a process called backpropagation:

1. **Forward Pass**: Data flows through the network
2. **Calculate Loss**: Compare prediction to actual
3. **Backward Pass**: Adjust weights to minimize loss
4. **Repeat**: Until the model converges

## Activation Functions

Activation functions introduce non-linearity:
- ReLU: max(0, x)
- Sigmoid: 1 / (1 + e^-x)
- Tanh: (e^x - e^-x) / (e^x + e^-x)

## Applications

- Image recognition
- Natural language processing
- Speech recognition
- Game playing (AlphaGo)
- Autonomous vehicles

## Getting Started

Start with simple feedforward networks using libraries like TensorFlow or PyTorch. Build your intuition before diving into complex architectures.

Happy learning!
    `,
    category: "Deep Learning",
    tags: ["Neural Networks", "Deep Learning", "AI", "Tutorial"],
    author: "Muhammad Ketsar Ali Abi Wahid",
    publishedDate: "2024-10-28",
    readTime: "10 min read",
    image: "blog-neural-networks.jpg",
    featured: true,
  },
  {
    id: 4,
    title: "Data Preprocessing Best Practices",
    slug: "data-preprocessing-best-practices",
    excerpt:
      "Learn the essential techniques for preparing your data for machine learning. Quality data leads to quality models.",
    content: `
# Data Preprocessing Best Practices

Clean data is the foundation of successful machine learning projects. Here's how to do it right.

## Why Preprocessing Matters

"Garbage in, garbage out" - Your model is only as good as your data.

## Essential Steps

### 1. Handle Missing Values
- Remove rows/columns
- Imputation (mean, median, mode)
- Forward/backward fill
- Predictive imputation

### 2. Handle Outliers
- Detect using IQR or Z-score
- Remove or cap extreme values
- Consider domain knowledge

### 3. Feature Scaling
- Standardization (mean=0, std=1)
- Normalization (0 to 1 range)
- Robust scaling (for outliers)

### 4. Encoding Categorical Variables
- One-hot encoding
- Label encoding
- Target encoding
- Frequency encoding

### 5. Feature Engineering
- Create new features
- Polynomial features
- Interaction terms
- Domain-specific features

### 6. Handle Imbalanced Data
- Oversampling (SMOTE)
- Undersampling
- Class weights
- Ensemble methods

## Data Quality Checks

Always perform:
- Check data types
- Verify distributions
- Look for duplicates
- Validate ranges
- Check correlations

## Automation

Use pipelines to ensure reproducibility:
- sklearn.pipeline
- Feature-engine
- Custom transformers

## Conclusion

Invest time in preprocessing. It's often the difference between a mediocre and excellent model.
    `,
    category: "Data Science",
    tags: ["Data Preprocessing", "Data Cleaning", "Machine Learning", "Best Practices"],
    author: "Muhammad Ketsar Ali Abi Wahid",
    publishedDate: "2024-10-15",
    readTime: "7 min read",
    image: "blog-data-preprocessing.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Optimization in Machine Learning: Beyond Prediction",
    slug: "optimization-machine-learning-beyond-prediction",
    excerpt:
      "Discover how mathematical optimization can enhance your ML models and solve complex business problems beyond simple prediction.",
    content: `
# Optimization in Machine Learning: Beyond Prediction

Most data scientists focus on prediction accuracy, but optimization can unlock even more business value.

## What is Mathematical Optimization?

Optimization finds the best solution from a set of possible choices, subject to constraints.

## Why Combine ML with Optimization?

1. **Better Decisions**: Not just "what will happen" but "what should we do"
2. **Resource Allocation**: Maximize profit, minimize cost
3. **Real-world Constraints**: Capacity, budget, time limits
4. **Prescriptive Analytics**: Move from prediction to action

## Common Applications

### Supply Chain Optimization
- Route planning (TSP, VRP)
- Inventory management
- Warehouse location

### Energy Management
- Power grid optimization
- Charging station placement (like my SPKLU project!)
- Renewable energy scheduling

### Finance
- Portfolio optimization
- Risk management
- Trading strategies

## Tools and Libraries

### Python Libraries:
- **Pyomo**: Flexible optimization modeling
- **Google OR-Tools**: Fast and scalable
- **PuLP**: Linear programming
- **CVXPY**: Convex optimization

## Case Study: SPKLU Location Optimizer

In my project, I combined:
- ML for demand prediction
- Geospatial analysis for coverage
- Optimization for location selection

Result: Optimal placement of EV charging stations balancing coverage, demand, and budget.

## Getting Started

1. Learn linear programming
2. Understand constraint modeling
3. Practice with small problems
4. Scale to real-world scenarios

## Conclusion

Optimization takes your ML from "interesting insights" to "actionable solutions". Essential for high-impact data science!
    `,
    category: "Optimization",
    tags: ["Optimization", "Machine Learning", "Operations Research", "Advanced"],
    author: "Muhammad Ketsar Ali Abi Wahid",
    publishedDate: "2024-11-12",
    readTime: "9 min read",
    image: "blog-optimization.jpg",
    featured: true,
  },
];

export const categories = ["All", "Tutorial", "Tools & Libraries", "Deep Learning", "Data Science", "Optimization"];
