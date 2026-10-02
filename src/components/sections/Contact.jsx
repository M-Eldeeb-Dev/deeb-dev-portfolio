import { useState, useRef } from "react";
import Section from "../common/Section";
import Reveal from "../common/Reveal";
import GlassCard from "../common/GlassCard";
import Button from "../common/Button";
import Pill from "../common/Pill";
import { siteConfig } from "../../data/siteConfig";
import { useClipboard } from "../../hooks/useClipboard";
import { useToast } from "../common/Toast";
import {
  LuSend,
  LuCopy,
  LuCheck,
  LuMail,
  LuClock,
  LuMapPin,
  LuExternalLink,
  LuCircleAlert,
  LuCircleCheck,
  LuLinkedin,
} from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export default function Contact() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
    _gotcha: "", // Honeypot field
  });

  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const formMountTimeRef = useRef(Date.now());
  const emailjsRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);

  const { copy, copied } = useClipboard();
  const { toast } = useToast();

  // Dynamically import @emailjs/browser on first user interaction
  const preloadEmailJS = async () => {
    if (!emailjsRef.current) {
      try {
        const module = await import("@emailjs/browser");
        emailjsRef.current = module.default || module;
      } catch (err) {
        console.error("Failed to dynamically load @emailjs/browser:", err);
      }
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
          return "Please enter a valid email address.";
        }
        return "";
      case "message":
        if (!value.trim()) return "Message cannot be empty.";
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters.";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Honeypot anti-spam check
    if (formValues._gotcha) {
      console.warn("Spam honeypot triggered.");
      setStatus("success");
      return;
    }

    // 2. Minimum-fill-time bot check (reject submissions completed under 2.5 seconds)
    const timeSpent = (Date.now() - formMountTimeRef.current) / 1000;
    if (timeSpent < 2.5) {
      console.warn("Submission too rapid (suspected automation).");
      setStatus("error");
      setErrorMessage("Submission failed validation. Please try again.");
      return;
    }

    // 3. Client rate throttle (60s between submissions)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 60000) {
      const waitSeconds = Math.ceil(
        (60000 - (now - lastSubmitTimeRef.current)) / 1000
      );
      setStatus("error");
      setErrorMessage(
        `Rate limit reached. Please wait ${waitSeconds}s before submitting again.`
      );
      return;
    }

    // 4. Validate all fields
    const errors = {
      name: validateField("name", formValues.name),
      email: validateField("email", formValues.email),
      message: validateField("message", formValues.message),
    };

    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await preloadEmailJS();
      const emailjs = emailjsRef.current;

      const serviceId =
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_pgmiywc";
      const templateId =
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_pifqbd4";
      const publicKey =
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "QYZffDJxOm4MxO3Kb";

      if (!emailjs) {
        throw new Error("Email service is unavailable. Please use direct email.");
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          message: formValues.message.trim(),
        },
        publicKey
      );

      lastSubmitTimeRef.current = Date.now();
      setStatus("success");
      setFormValues({ name: "", email: "", message: "", _gotcha: "" });
      toast({
        title: "Message Sent!",
        message: "Thank you for reaching out. I will respond promptly.",
        type: "success",
      });
    } catch (err) {
      console.error("EmailJS submission failed:", err);
      setStatus("error");
      setErrorMessage(
        "Direct sending failed. Please copy my email below or open your mail client."
      );
      toast({
        title: "Sending Failed",
        message: "Please use the direct email link or try again later.",
        type: "error",
      });
    }
  };

  const handleCopyEmail = async () => {
    const success = await copy(siteConfig.email);
    if (success) {
      toast({
        title: "Copied!",
        message: `Email copied to clipboard (${siteConfig.email})`,
        type: "success",
      });
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Initiate Contact"
      title="Let's Build Something Exceptional"
      description="Available for full-time engineering roles, high-impact freelance contracts, and open-source collaboration."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Container (Col 1-7) */}
        <div className="lg:col-span-7">
          <Reveal>
            <GlassCard className="p-6 sm:p-8">
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-sans">
                Fill out the form below. Messages are delivered directly to my inbox.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                onFocus={preloadEmailJS}
                className="space-y-5"
              >
                {/* Honeypot field (hidden from assistive technologies) */}
                <div aria-hidden="true" className="sr-only">
                  <label htmlFor="_gotcha">Leave this field blank</label>
                  <input
                    id="_gotcha"
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formValues._gotcha}
                    onChange={handleChange}
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Your Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={
                      formErrors.name ? "name-error" : undefined
                    }
                    value={formValues.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Jane Doe"
                    className={`w-full px-4 py-2.5 rounded-xl bg-surface-2 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      formErrors.name
                        ? "border-rose-500/80"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {formErrors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-400 flex items-center gap-1"
                    >
                      <LuCircleAlert className="w-3.5 h-3.5" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                    value={formValues.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jane@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-surface-2 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      formErrors.email
                        ? "border-rose-500/80"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {formErrors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-400 flex items-center gap-1"
                    >
                      <LuCircleAlert className="w-3.5 h-3.5" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Message <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    aria-invalid={Boolean(formErrors.message)}
                    aria-describedby={
                      formErrors.message ? "message-error" : undefined
                    }
                    value={formValues.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell me about your project, timeline, or open engineering role..."
                    className={`w-full px-4 py-2.5 rounded-xl bg-surface-2 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-y min-h-[120px] ${
                      formErrors.message
                        ? "border-rose-500/80"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {formErrors.message && (
                    <p
                      id="message-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-400 flex items-center gap-1"
                    >
                      <LuCircleAlert className="w-3.5 h-3.5" />
                      <span>{formErrors.message}</span>
                    </p>
                  )}
                </div>

                {/* Status Announcements (Aria-live) */}
                <div aria-live="polite" className="min-h-[1.5rem]">
                  {status === "success" && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <LuCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Message transmitted successfully! I will reply via email shortly.
                      </span>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <LuCircleAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <a
                          href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
                          className="text-cyan-400 underline font-mono text-xs"
                        >
                          Launch Mail Client
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="text-slate-300 underline font-mono text-xs cursor-pointer"
                        >
                          Copy Email Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  variant="primary"
                  size="md"
                  magnetic
                  className="w-full sm:w-auto"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <LuSend className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </GlassCard>
          </Reveal>
        </div>

        {/* Direct Channels Card (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <Reveal delay={100}>
            <GlassCard className="p-6 sm:p-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Pill variant="success" size="sm" dot dotPulse>
                    {siteConfig.status.label}
                  </Pill>
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Direct Communication
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Prefer direct contact? Connect through professional networks or send an email directly.
                </p>
              </div>

              {/* Channels List */}
              <div className="space-y-3 pt-2">
                {/* Email Item */}
                <div className="p-3.5 rounded-xl bg-surface-2 border border-white/[0.08] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-violet-950/60 text-violet-400 shrink-0">
                      <LuMail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Primary Email
                      </div>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-xs sm:text-sm text-slate-200 hover:text-cyan-400 truncate block font-mono"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <LuCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <LuCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* GitHub Item */}
                <a
                  href="https://github.com/M-Eldeeb-Dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface-2 border border-white/[0.08] hover:border-violet-500/40 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-200 shrink-0">
                      <SiGithub className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        GitHub Profile
                      </div>
                      <div className="text-xs sm:text-sm text-slate-200 font-mono">
                        github.com/M-Eldeeb-Dev
                      </div>
                    </div>
                  </div>
                  <LuExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </a>

                {/* LinkedIn Item */}
                <a
                  href="https://www.linkedin.com/in/mh-deeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface-2 border border-white/[0.08] hover:border-cyan-500/40 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 shrink-0">
                      <LuLinkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        LinkedIn Network
                      </div>
                      <div className="text-xs sm:text-sm text-slate-200 font-mono">
                        in/mh-deeb
                      </div>
                    </div>
                  </div>
                  <LuExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>

              {/* Location & Time Zone */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <LuMapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cairo, Egypt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LuClock className="w-3.5 h-3.5 text-violet-400" />
                  <span>UTC+2 (EET)</span>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
