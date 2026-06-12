# CivicVoice Client 🌐

This subdirectory contains the frontend web application for the CivicVoice citizen-engagement platform. It is a single-page application built on React, styled with Tailwind CSS, and optimized with Vite.

---

## 🛠️ Technology Stack

*   **Core**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Interactive Maps**: [Leaflet](https://leafletjs.com/) via [React Leaflet](https://react-leaflet.js.org/)
*   **Real-Time Data**: [Socket.io Client](https://socket.io/docs/v4/client-api/)
*   **Routing**: [React Router DOM v6](https://reactrouter.com/)
*   **HTTP client**: [Axios](https://axios-http.com/)

---

## 📁 Router & Pages

The application has role-based page permissions set up under [App.jsx](src/App.jsx). Below are the defined pages:

1.  **`/` - Landing Page**: Introducing features and showcasing statistics.
2.  **`/map` - Map Dashboard**: The core interface displays a interactive Leaflet map marking all nearby infrastructure issues with category indicators.
3.  **`/login` / Registration**: Unified portal to authenticate users or sign up citizens.
4.  **`/forgot-password` & `/reset-password`**: Flows to handle secure password recovery.
5.  **`/report` (Protected)**: Allows logged-in citizens to submit issues by dropping a pin, supplying category information, detailing reports, and optionally uploading files.
6.  **`/admin` (Protected - Admin Only)**: Comprehensive control board to trace issues, filters, status indicators, and transition issue lifecycle phases.

---

## ⚙️ Local Configuration

Create a `.env` file in this folder (`civicvoice-client/.env`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### Standalone Development Run
Make sure you have installed the project packages. Run the client standalone development server:

```bash
# Navigate to the client directory
cd civicvoice-client

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

The app will be active locally at [http://localhost:5173](http://localhost:5173).

### Building for Production
To generate a compiled bundle optimized for static hosting engines (such as Nginx):

```bash
npm run build
```
This outputs compiled assets to the `./dist` directory.
