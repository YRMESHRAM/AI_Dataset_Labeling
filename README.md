# 🤖 AI-Powered Automated Dataset Generation & Labeling Tool

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22.0-FF6F00?style=flat-square&logo=tensorflow)](https://www.tensorflow.org/js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A modern, responsive web application designed for computer vision researchers and dataset creation workflows. This tool automatically classifies and labels images locally in your browser using **TensorFlow.js** and **MobileNet v2**, eliminating the need for server-side processing or external API keys.

---

## ✨ Features

### 🧠 1. Local In-Browser AI Auto-Labeling

- **MobileNet v2 Engine**: Classifies uploaded images into 1,000+ ImageNet categories using browser WebGL hardware acceleration.
- **100% Client-Side & Private**: No images are uploaded to any external server or cloud service. Your dataset remains completely private.
- **Confidence Scoring**: Displays top 5 prediction probabilities per image for quality verification.
- **Automatic Queue Processing**: Upload multiple images and let the model sequentially label them in real time.

### 🖼️ 2. Seamless Image Upload & Batch Operations

- **Drag-and-Drop**: Easily drop single or bulk image files (`.jpg`, `.jpeg`, `.png`).
- **Interactive Quick Labels**: One-click quick-label suggestions (`Cat`, `Dog`, `Car`, `Tree`, `Person`, `Building`, `Animal`, `Food`) for fast manual tagging.
- **Re-classification & Overrides**: Re-run AI predictions or override machine labels with custom user input.

### 📊 3. Interactive Dataset Preview & Search

- **Dual View Modes**: Responsive table layout for desktop screens and clean card layout for mobile devices.
- **Real-time Filtering & Search**: Instant text search across image names and assigned labels.
- **Source Tracking**: Clear visual indicators distinguishing AI auto-labeled tags from manual user tags.

### 📥 4. Machine Learning Export (CSV)

- **Structured Export**: Download metadata ready for ML training pipelines.
- **Export Metadata**: Includes `Image Name`, `Label`, `Label Source`, `AI Confidence`, and `File Size`.
- **Summary Dashboard**: Real-time progress indicators showing completion metrics and dataset storage size.

### 🎨 5. Modern UI & Theme Controls

- **Light / Dark Mode**: Dynamic theme switching backed by `localStorage` persistence.
- **Glassmorphism Aesthetic**: Rich visuals with micro-animations, gradient highlights, and responsive layouts.

---

## 🛠️ Tech Stack

| Component              | Technology                             | Description                             |
| :--------------------- | :------------------------------------- | :-------------------------------------- |
| **Frontend Framework** | React 19 + TypeScript                  | Component-based UI with strict typing   |
| **Build System**       | Vite 7                                 | High-performance dev server & bundler   |
| **Machine Learning**   | `@tensorflow/tfjs` + MobileNet v2      | In-browser deep learning classification |
| **Styling**            | Tailwind CSS 4 + Vanilla CSS Variables | Modern styling & glassmorphism theme    |
| **Iconography**        | Lucide React                           | Modern vector icon set                  |

---

## 🔄 How It Works

```
   ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
   │                  │       │                  │       │                  │
   │  1. Add Images   │ ────► │  2. AI MobileNet │ ────► │ 3. Preview & Edit│
   │  (Drag & Drop)   │       │   Classification │       │   (Table / Cards)│
   │                  │       │                  │       │                  │
   └──────────────────┘       └──────────────────┘       └──────────────────┘
                                                                  │
                                                                  ▼
                                                         ┌──────────────────┐
                                                         │                  │
                                                         │   4. Export CSV  │
                                                         │   (ML Pipeline)  │
                                                         │                  │
                                                         └──────────────────┘
```

1. **Model Initialization**: The application dynamically loads the `@tensorflow-models/mobilenet` weights (~16MB) on demand and caches them locally.
2. **Image Ingestion**: Uploaded files are converted into data URLs for rendering and passed into canvas/image elements for Tensor conversion.
3. **Classification Loop**: TensorFlow.js runs forward inference pass on the image tensors and outputs probability distributions.
4. **Dataset Refinement**: Inspect predictions, manually adjust metadata if needed, and verify progress.
5. **Exporting**: Click **Export Dataset** to receive formatted `.csv` output.

---

## 📁 Repository Structure

```text
build-dataset-generation-tool/
├── public/                # Static public assets
├── src/
│   ├── components/        # React components
│   │   ├── AboutPage.tsx        # Technical overview & feature list
│   │   ├── Dashboard.tsx        # Main navigation & live stats dashboard
│   │   ├── DatasetPreview.tsx   # Searchable dataset table/card view
│   │   ├── ExportDataset.tsx    # CSV exporter & dataset summary
│   │   ├── Header.tsx           # Navigation header & theme switcher
│   │   ├── LandingPage.tsx      # Hero section & onboarding
│   │   ├── Notification.tsx     # Toast notification system
│   │   └── UploadImages.tsx     # Bulk upload, AI trigger, & labeling grid
│   ├── hooks/
│   │   └── useImageClassifier.ts # Custom React hook for TensorFlow.js MobileNet
│   ├── utils/
│   │   └── cn.ts                # Classname helper utility
│   ├── App.tsx            # Main Application state router & layout
│   ├── main.tsx           # React entrypoint
│   ├── index.css          # Core CSS variables, glassmorphism & utility styles
│   └── types.ts           # TypeScript interfaces & types
├── index.html             # HTML entry point
├── package.json           # Project dependencies & scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the project folder:

   ```bash
   cd "build-dataset-generation-tool (1)"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Launch the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at the local URL provided by Vite (e.g. `http://localhost:5173`).

---

## ⚙️ Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and builds the app for production in the `dist` folder.
- `npm run preview`: Previews the production build locally.

---

## 📄 CSV Export Format Example

The generated CSV export follows this structure:

```csv
Image Name,Label,Label Source,AI Confidence,File Size
"sample_cat.jpg","Tabby Cat","AI (MobileNet)","94.2%","142.5 KB"
"dog_park.png","Golden Retriever","Manual","N/A","850.1 KB"
```

---

## 🛡️ Privacy & Performance

- **Zero Backend Dependency**: TensorFlow.js model runs strictly inside the browser environment.
- **No Network Overheads**: After initial model loading, all predictions occur offline without network latency or data transfer.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
