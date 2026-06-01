# Ahmed Sobhy Portfolio & Admin Dashboard

This is a dynamic portfolio for a Senior Performance Media Buyer, built with Next.js, Tailwind CSS, and Firebase.

## Firebase Project Details

- **Project ID:** `studio-6084148158-974fb`
- **Firebase Console:** [https://console.firebase.google.com/project/studio-6084148158-974fb](https://console.firebase.google.com/project/studio-6084148158-974fb)

## Getting Started

1. **Setup Admin Access:**
   - Go to the [Firebase Console](https://console.firebase.google.com/project/studio-6084148158-974fb).
   - Navigate to **Authentication** -> **Sign-in method**.
   - Enable **Email/Password**.
   - Navigate to **Users** and click **Add User** (e.g., `admin@gmail.com`).
   - Use these credentials to log in at `/login`.

2. **Initialize Data:**
   - Once logged into the `/dashboard`, click the **"Init Setup"** button to seed your professional info and sample case studies.

3. **Manage Portfolio:**
   - **Leads:** View incoming consultation requests.
   - **Profile:** Update your bio, title, and contact details.
   - **Projects:** Add or edit your performance marketing case studies (ROAS, CAC, etc.).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Backend:** Firebase (Firestore & Auth)
- **AI:** Genkit for marketing copy generation
