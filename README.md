# Concert Tickets Generator

A modern web application built with [TanStack Start](https://tanstack.com/start) and React that allows you to design, customize, and download high-quality concert ticket souvenirs.

## Features

- **Custom Ticket Design**: Personalize tickets with artist name, date, venue, city, and specific seating/placement details.
- **Concert Search Integration**: Integrated with the Setlist.fm API to easily search for real concerts and autofill ticket information.
- **High-Quality Export**: Generate and download your custom tickets as print-ready 300 DPI PNG images (powered by `html-to-image` and `sharp`).
- **Responsive UI**: A beautiful, fully responsive interface featuring mobile-friendly drawers and desktop popovers, built with TailwindCSS v4 and shadcn/ui.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing & Backend**: [TanStack Router](https://tanstack.com/router) & [TanStack Start](https://tanstack.com/start) (powered by Nitro)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Image Processing**: `html-to-image` for DOM-to-image rendering, `sharp` for DPI metadata injection.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed along with `pnpm`.

### Installation

Install the dependencies using pnpm:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
pnpm run build
```

You can preview the production build locally with:

```bash
pnpm run preview
```

### Formatting & Testing

- **Run UI/Unit Tests**: `pnpm run test`
- **Linting & Formatting**: `pnpm run check`
