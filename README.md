[Updated on Jan 16th 2026]

# Desiary

Desiary is a comprehensive travel companion application that combines journey planning with digital memory keeping. It leverages AI to generate personalized travel itineraries and provides a platform for travelers to document their experiences.

## Features

- **AI Itinerary Generator**: Create detailed, day-by-day travel plans using Gemini AI.
- **Digital Journal**: Document your travel memories with text and media.
- **Wishlist**: dedicated space to keep track of dream destinations.
- **Travel Memories**: Store and organize your travel photos and moments.
- **User Authentication**: Secure signup and login functionality.

## How to Download and Execute

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    Open your terminal or command prompt and run:
    ```bash
    git clone https://github.com/AvaniDange/Desiary-.git
    cd Desiary-
    ```

2.  **Install dependencies**
    Install the required NPM packages:
    ```bash
    npm install
    ```

3.  **Environment Setup**
    This project requires a Google Gemini API key for the AI features.
    - Create a file named `.env` in the root directory.
    - Add your API key:
      ```env
      VITE_GEMINI_KEY=your_gemini_api_key_here
      ```
    > Note: You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### Running the Application

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## How it Works

Desiary is built with a modern tech stack ensuring a smooth and responsive user experience:

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) for fast development and optimized production builds.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid and responsive UI design.
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) to power the itinerary generation feature.
- **Backend/Services**: [Firebase](https://firebase.google.com/) for user authentication and data storage.
- **Routing**: React Router for seamless navigation between pages (Home, Itinerary, Journal, etc.).