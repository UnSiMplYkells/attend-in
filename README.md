# attend•in

Attend•in is a modern, responsive, and robust student attendance tracking application built with Next.js and Tailwind CSS. It leverages a secure serverless backend powered by Supabase, high-performance API rate limiting through Upstash Redis, and real-time push notifications using Firebase Cloud Messaging (FCM).

## Features

- **Role-Based Access Control**: Separate dashboards and functionalities for Students, Class Representatives, and Administrators.
- **Real-time Attendance Tracking**: Lecturers and Class Reps can initiate attendance sessions, and students can mark their presence in real-time.
- **QR Code Generation & Scanning**: Generate unique QR codes for attendance sessions and scan them using the built-in QR code scanner.
- **GPS Geofencing**: Ensures students can only mark their attendance when they are within a specified range of the classroom, using the Haversine formula for accurate distance calculation.
- **Device Fingerprinting**: Prevents cheating by creating a unique fingerprint for each student's device.
- **Push Notifications**: Real-time notifications for important events, powered by Firebase Cloud Messaging.
- **Data Visualization**: Interactive charts and graphs to visualize attendance data, built with Recharts.
- **Bulk Data Upload**: Administrators can upload student and course data in bulk using Excel/CSV files.

## Tech Stack

| Category          | Technology                                                                                             | Description                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**         | [Next.js](https://nextjs.org/) 14+                                                                       | A React framework for building full-stack web applications with the App Router.                                                          |
| **Styling**           | [Tailwind CSS](https://tailwindcss.com/) v4                                                            | A utility-first CSS framework for rapidly building custom user interfaces.                                                               |
| **Database & Auth** | [Supabase](https://supabase.io/)                                                                       | An open-source Firebase alternative providing a PostgreSQL database, authentication, and instant APIs.                                     |
| **Rate Limiting**     | [Upstash Redis](https://upstash.com/redis)                                                             | A serverless Redis provider used for implementing robust API rate limiting.                                                              |
| **Notifications**     | [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)                   | A cross-platform messaging solution for sending real-time push notifications.                                                            |
| **State Management**  | [Zustand](https://github.com/pmndrs/zustand)                                                           | A small, fast, and scalable state management solution for React.                                                                         |
| **Data Fetching**     | [TanStack Query](https://tanstack.com/query/v5)                                                        | A powerful data-fetching and caching library for React.                                                                                  |
| **UI & Animation**    | [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/), [Three.js](https://threejs.org/) | Libraries for creating fluid animations, interactive charts, and 3D graphics.                                                              |

## Prerequisites

- **Node.js**: `v18.17.0` or `v20.x`
- **Package Manager**: `npm`

## Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/UnSiMplYkells/attend-in.git
    cd attend-in
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the `.env.example` file. Then, fill in the required environment variables.

    ```bash
    cp .env.example .env
    ```

    You will need to add your credentials for:
    - Supabase (URL and Public Key)
    - Firebase (Web app configuration and FCM VAPID key)
    - Upstash Redis (REST URL and Token)


## Usage

- **Run the development server:**

  ```bash
  npm run dev
  ```

- **Build for production:**

  ```bash
  npm run build
  ```

- **Start the production server:**

  ```bash
  npm run start
  ```

- **Lint the code:**

  ```bash
  npm run lint
  ```
