import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";

// page.jsx is a Server Component — wrap the client form in Suspense
// because LoginForm uses useSearchParams() which requires a Suspense boundary
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #080D2E 0%, #0F172A 100%)",
          }}
        >
          <Loader2
            size={32}
            style={{ color: "#5994FA", animation: "spin 1s linear infinite" }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
