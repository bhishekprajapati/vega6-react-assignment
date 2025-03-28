# Demo

[Demo Video](https://raw.githubusercontent.com/bhishekprajapati/vega6-react-assignment/main/public/demo.mp4)

## Run Locally

Create a `.env` file in project root. For reference, checkout `.env.example` file and fill out the all variables in .env.

To get the unsplash api keys, head over to [register as developer on unsplash](https://unsplash.com/developers)

```bash
pnpm i && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### 🔍 Search Page Design

- [x] Implemented search input
- [x] Display search results with images
- [x] Each result has an **"Add Captions"** button

#### Bonus

- [x] **Added loading state** while searching 🔄
- [x] **Used SWR pattern** for search requests ⚡

### 🖼️ Image Handling and Display

- [x] Clicking "Add Captions" loads the image onto the Fabric.js canvas

### 🎨 Canvas Interaction

- [x] Users can add **editable & resizable text layers**
- [x] Users can add **basic shapes** (Triangle, Circle, Rectangle, Polygon)
- [x] Shapes are **layered above the image**
- [x] Text layers are **always above shapes**
- [x] Users can **drag, resize, and reposition** shapes & text

### 📥 Download Functionality

- [x] "Download" button generates & downloads the final image

### ⚠️ Error Handling & Validation

- [x] Handled API request errors
- [x] Validated search queries & user inputs
- [x] Proper feedback messages for errors

### 🛠️ Additional Enhancements (Bonus)

- [x] **Loading state** while searching images
- [x] **SWR pattern** for efficient search requests
- [x] **Format selection** before download (PNG, JPEG, etc.)
- [x] **Small preview** before download
- [x] **JSON Debugger UI** to view real-time canvas state
- [x] **Debouncing** for search input & preview updates
- [x] **End-to-end type safety** (APIs → Backend → Frontend UI)

✅ **All functional requirements implemented!**
