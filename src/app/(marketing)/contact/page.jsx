"use client";
import { useState } from "react";
import { MdEmail, MdLocationOn, MdPhone, MdSend } from "react-icons/md";
import Button from "@/app/components/ui/Button";
import Navigation from "../components/Navigation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Device Reset Request", // Default helpful subject
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send email would go here
    alert("Message sent! (This is a demo)");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <div className="relative z-10 w-full text-white font-sans selection:bg-indigo-500/30 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">
            Support Center
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            How can we help?
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Having trouble checking in? Need to unbind your old device? Fill out
            the form below and our admin team will assist you.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <MdEmail className="text-xl" />
                  </div>
                  <span>africanedu24@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <MdPhone className="text-xl" />
                  </div>
                  <span>+234 800 123 4567</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <MdLocationOn className="text-xl" />
                  </div>
                  <span>Department of Computer Science, UNN</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                Common Questions
              </h3>
              <dl className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <dt className="font-semibold text-indigo-300">
                    I changed my phone. How do I login?
                  </dt>
                  <dd className="mt-2 text-sm text-gray-400">
                    Your account is bound to your old device. Use the form to
                    request a "Device Reset" and include your Matric Number.
                  </dd>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <dt className="font-semibold text-indigo-300">
                    It says "Location too far"?
                  </dt>
                  <dd className="mt-2 text-sm text-gray-400">
                    Ensure your Location is on and you are be within 50m of the hall.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  className="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none [&>option]:bg-gray-900"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option>Device Reset Request</option>
                  <option>Location/GPS Issue</option>
                  <option>Account Access</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Please include your Matric Number..."
                  className="block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button type="submit" variant="primary">
                <span className="flex items-center gap-2">
                  Send Message <MdSend />
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
