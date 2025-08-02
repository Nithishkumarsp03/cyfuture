
import RouteNavigation from "./routes/Route";
import { ToastProvider } from "./components/Toast/ToastContext";

export default function App() {
  return (
    <div className="h-full w-full">
      {/* <h1 className="text-3xl font-bold">NextUI + Tailwind + Dark Mode</h1>
      <Button color="primary" className="mt-4">Hello World</Button>
      <button onClick={() => document.documentElement.classList.toggle("dark")} className="mt-2 underline">
        Toggle Dark Mode
      </button>
      <IndustryIllustration /> */}
      <ToastProvider>
        <RouteNavigation />
      </ToastProvider>
    </div>
  );
}
