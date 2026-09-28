import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LuCircleCheck, LuCircleAlert, LuX, LuInfo } from "react-icons/lu";

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);
  const remainingRef = useRef(toast.duration || 4000);
  const startTimeRef = useRef(Date.now());

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);
  }, [onDismiss, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const isError = toast.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocus={pauseTimer}
      onBlur={resumeTimer}
      className={`pointer-events-auto flex items-center gap-3 w-full max-w-sm rounded-xl px-4 py-3 shadow-2xl transition-all duration-300 border ${
        isError
          ? "bg-rose-950/90 text-rose-200 border-rose-500/40"
          : "bg-surface-2/95 text-slate-100 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      } backdrop-blur-md`}
    >
      <div className="shrink-0 text-lg">
        {toast.type === "success" && (
          <LuCircleCheck className="text-emerald-400" />
        )}
        {toast.type === "error" && (
          <LuCircleAlert className="text-rose-400" />
        )}
        {toast.type === "info" && (
          <LuInfo className="text-cyan-400" />
        )}
      </div>

      <div className="flex-1 text-sm font-sans leading-snug">
        {toast.title && <div className="font-semibold text-white">{toast.title}</div>}
        <div>{toast.message}</div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
      >
        <LuX className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = "success", duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast = { id, title, message, type, duration };

      setToasts((prev) => {
        // Enforce max 3 stacked toasts
        const next = [...prev, newToast];
        return next.slice(-3);
      });

      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
