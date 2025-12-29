import { useEffect, useMemo, useRef, useState } from "react";


const COOKIE_NAME = "submission_record";
const LS_RECORD_KEY = "submission_record";
const LS_LOG_KEY = "submissions_log";


function uuidv4() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);

  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const toHex = (n) => n.toString(16).padStart(2, "0");
  const hex = Array.from(buf, toHex).join("");
  return (
    hex.slice(0, 8) +
    "-" +
    hex.slice(8, 12) +
    "-" +
    hex.slice(12, 16) +
    "-" +
    hex.slice(16, 20) +
    "-" +
    hex.slice(20)
  );
}


async function sha256Hex(input) {

  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}


function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const encoded = encodeURIComponent(value);

    document.cookie = `${name}=${encoded}; expires=${expires.toUTCString()}; path=/; samesite=strict`;
  } catch (_) {
  }
}

function getCookie(name) {
  try {
    const target = `${name}=`;
    const parts = document.cookie.split(";");
    for (let c of parts) {
      const trimmed = c.trim();
      if (trimmed.startsWith(target)) {
        const v = trimmed.substring(target.length);
        return decodeURIComponent(v);
      }
    }
    return null;
  } catch (_) {
    return null;
  }
}

function readLocal(key) {
  try {
    const v = localStorage.getItem(key);
    return v;
  } catch (_) {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // swallow
  }
}

const nameRegex = /^[A-Za-z\s-]{2,100}$/; // letters, spaces, hyphen; 2–100 chars
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // simple RFC-like

export default function SecureContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [disabled, setDisabled] = useState(false);
  const [notice, setNotice] = useState(false);
  const [tampered, setTampered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState(null); // 'sending', 'success', 'error'
  const debounceRef = useRef(false);
  const submissionsLogRef = useRef([]);
  const recordRef = useRef(null); // holds last valid submissionRecord JSON

  // Precompute hashes for "false" and "true"
  const hashesPromise = useMemo(() => {
    return Promise.all([sha256Hex("false"), sha256Hex("true")]);
  }, []);

  // Validation helpers
  const validate = (fields) => {
    const e = { name: "", email: "", message: "" };
    const { name, email, message } = fields;

    if (!nameRegex.test(name.trim())) {
      e.name = "Name must be 2–100 letters, spaces or hyphens.";
    }
    if (!emailRegex.test(email.trim())) {
      e.email = "Enter a valid email address.";
    }
    const msg = message.trim();
    if (msg.length < 5 || msg.length > 2000) {
      e.message = "Message must be between 5 and 2000 characters.";
    }
    return e;
  };

  // Initialize EmailJS
  useEffect(() => {
    if (window.emailjs && window.emailjs.init) {
      // Replace with your EmailJS public key
      window.emailjs.init("QYZffDJxOm4MxO3Kb");
    }
  }, []);

  // Load submissions log from localStorage (in-memory primary, persisted for future)
  useEffect(() => {
    try {
      const raw = readLocal(LS_LOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          submissionsLogRef.current = parsed;
        }
      }
    } catch (_) {
      // ignore parse errors
    }
  }, []);

  // On mount: initialize or check submission_record in both cookie and localStorage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [hashFalse, hashTrue] = await hashesPromise;

        // Read cookie and LS
        const cookieStr = getCookie(COOKIE_NAME);
        const lsStr = readLocal(LS_RECORD_KEY);

        if (!cookieStr && !lsStr) {
          // Create new record with sent = SHA256("false")
          const record = {
            id: uuidv4(),
            sent: hashFalse,
            ts: new Date().toISOString(),
          };
          const json = JSON.stringify(record);
          setCookie(COOKIE_NAME, json); // sameSite=strict; 1-year expiry
          writeLocal(LS_RECORD_KEY, json);
          recordRef.current = record;
        } else {
          // If either exists, parse both and compare
          let cookieRec = null;
          let lsRec = null;
          try {
            if (cookieStr) cookieRec = JSON.parse(cookieStr);
          } catch (_) {}
          try {
            if (lsStr) lsRec = JSON.parse(lsStr);
          } catch (_) {}

          // If cookie exists but localStorage missing OR mismatch -> tamper
          const existsCookie = !!cookieRec;
          const existsLs = !!lsRec;
          const mismatch =
            existsCookie && existsLs
              ? cookieRec.id !== lsRec.id ||
                cookieRec.sent !== lsRec.sent ||
                cookieRec.ts !== lsRec.ts
              : false;

          if ((existsCookie && !existsLs) || mismatch) {
            const ts = new Date().toISOString();
            const idForLog = cookieRec?.id || "unknown";
            console.warn(
              `[tamper] ${ts} id=${idForLog}: cookie/localStorage removed or modified`
            );
            alert(
              "You have removed or tampered with required local storage/cookie — this action is logged as illegal activity."
            );
            if (mounted) setTampered(true);
            setLoading(false);
            return;
          }

          // If both exist (or only LS exists), prefer one consistent record
          const useRec = cookieRec || lsRec;
          if (useRec) {
            recordRef.current = useRec;
            // Ensure both sides have the same serialized value
            const json = JSON.stringify(useRec);
            if (cookieStr !== json) setCookie(COOKIE_NAME, json);
            if (lsStr !== json) writeLocal(LS_RECORD_KEY, json);

            // If already sent, disable and show notice
            if (useRec.sent === hashTrue) {
              setDisabled(true);
              setNotice(true);
            }
          }
        }
      } catch (_) {
        // If crypto or storage fails, best-effort: keep form usable but without record
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hashesPromise]);

  const onFieldChange = (setter) => (e) => {
    const v = e.target.value;
    setter(v);
    // live inline validation per field
    const next = validate({ name, email, message, [e.target.name]: v });
    setErrors(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (debounceRef.current) return;
    debounceRef.current = true;
    setTimeout(() => {
      debounceRef.current = false;
    }, 800); // debounce window

    if (tampered) return; // locked

    const fieldErrors = validate({ name, email, message });
    setErrors(fieldErrors);
    const hasErr = Object.values(fieldErrors).some((x) => x);
    if (hasErr) return;

    try {
      const [_, hashTrue] = await hashesPromise;

      // Send email via EmailJS
      setEmailStatus("sending");
      
      // Prepare template parameters for EmailJS

      try {
        const result = await window.emailjs.send(
          "service_pgmiywc","template_pifqbd4",
          {
            email: email.trim(),
            name: name.trim(),
            message: message.trim(),
          }
        );
        
        if (result.status === 200) {
          setEmailStatus("success");
        } else {
          throw new Error("Email service error");
        }
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
        setEmailStatus("error");

      }

      const submission = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        ts: new Date().toISOString(),
      };
      const nextLog = [...submissionsLogRef.current, submission];
      submissionsLogRef.current = nextLog;
      writeLocal(LS_LOG_KEY, JSON.stringify(nextLog));

      const current = recordRef.current || {
        id: uuidv4(),
        sent: "",
        ts: new Date().toISOString(),
      };
      const updated = {
        ...current,
        sent: hashTrue, // hash of literal "true"
        ts: new Date().toISOString(),
      };
      const json = JSON.stringify(updated);
      setCookie(COOKIE_NAME, json);
      writeLocal(LS_RECORD_KEY, json);
      recordRef.current = updated;

      // UI changes
      setDisabled(true);
      setNotice(true);

      // Clear email status after 3 seconds if successful
      if (emailStatus !== "error") {
        setTimeout(() => setEmailStatus(null), 3000);
      }
    } catch (err) {
      // Keep errors out of UI; do not leak hashes. Log minimal info.
      console.warn("Submission failed (client-side)");
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="text-white/60 text-sm">Initializing secure form…</div>
    );
  }

  if (tampered) {
    // Lock screen when tampering detected
    return (
      <div className="p-6 border border-red-500/30 rounded-2xl glass">
        <div className="flex items-center gap-3 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25V9H5.25A2.25 2.25 0 003 11.25v7.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-7.5A2.25 2.25 0 0018.75 9H17.25V6.75A5.25 5.25 0 0012 1.5zm-3.75 7.5V6.75a3.75 3.75 0 117.5 0V9h-7.5z" clipRule="evenodd" />
          </svg>
          <span className="font-montserrat uppercase tracking-wider">Access Locked</span>
        </div>
        <p className="text-white/70 mt-2">Form is unavailable due to detected tampering.</p>
      </div>
    );
  }

  return (
    <div>
      {notice && (
        <div className="mb-4 p-5 border border-accent/30 rounded-xl glass bg-gradient-to-r from-green-500 to-yellow-500">
          <p className="text-center font-roboto text-xxl mb-3 form-message-color">
            Message Sent Succeessfully, If You Want To Send More Details Go To My Email Or Change Device!
          </p>
        </div>
      )}
      {!notice && (
        <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white/70 uppercase tracking-wider text-sm mb-2">
            Name
          </label>
          <input
            autoComplete="off"
            id="name"
            name="name"
            type="text"
            disabled={disabled}
            value={name}
            onChange={onFieldChange(setName)}
            className="w-full glass bg-white/5 border border-white/10 focus:border-accent outline-none text-white px-4 py-3 rounded-xl"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-white/70 uppercase tracking-wider text-sm mb-2">
            Email
          </label>
          <input
            autoComplete="off"
            id="email"
            name="email"
            type="email"
            disabled={disabled}
            value={email}
            onChange={onFieldChange(setEmail)}
            className="w-full glass bg-white/5 border border-white/10 focus:border-accent outline-none text-white px-4 py-3 rounded-xl"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="message" className="block text-white/70 uppercase tracking-wider text-sm mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            disabled={disabled}
            value={message}
            onChange={onFieldChange(setMessage)}
            className="w-full glass bg-white/5 border border-white/10 focus:border-accent outline-none text-white px-4 py-3 rounded-xl"
            placeholder="Tell me about your project"
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">{errors.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || emailStatus === "sending"}
          className="btn-primary px-6 py-3 rounded-full cursor uppercase tracking-wider transition-colors text-base"
        >
          {emailStatus === "sending" ? "Sending..." : "Send Message"}
        </button>
        
        {/* Email status messages */}
        {emailStatus === "success" && (
          <p className="text-accent text-center font-roboto">
            Message sent! I'll get back to you soon.
          </p>
        )}
        {emailStatus === "error" && (
          <p className="text-red-400 text-center font-roboto">
            Email failed to send, but your message was saved locally.
          </p>
        )}
        </form>
      )}
    </div>
  );
}
