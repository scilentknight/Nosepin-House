import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-secondary-400/20" />
        <div className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full border border-secondary-400/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:px-8 sm:py-28 lg:px-12">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-secondary-300">
            Get In Touch
          </p>

          <h1 className="font-serif text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
            We would love to
            <span className="block italic text-secondary-300">
              hear from you.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-primary-100/80 sm:text-lg">
            Have a question about a piece, your order, or anything else? Our
            team is here to help you find the answers you need.
          </p>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12">
          {/* Contact Details */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
              Contact NOSEPINHOUSE
            </p>

            <h2 className="font-serif text-4xl leading-tight text-primary-800 sm:text-5xl">
              Let&apos;s start a
              <span className="block italic text-secondary-600">
                conversation.
              </span>
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-primary-700/70">
              Whether you need help choosing the perfect jewellery, have a
              question about an order, or simply want to say hello, we are
              always happy to hear from you.
            </p>

            <div className="mt-10 space-y-7">
              {/* Phone */}
              <a
                href="tel:+97701-5332279"
                className="group flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 transition-colors group-hover:bg-secondary-200">
                  <Phone size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
                    Phone
                  </p>

                  <p className="mt-1 text-base text-primary-800 transition-colors group-hover:text-secondary-600">
                    +977 01-5332279
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:nosepinhouse2068@gmail.com"
                className="group flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 transition-colors group-hover:bg-secondary-200">
                  <Mail size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
                    Email
                  </p>

                  <p className="mt-1 text-base text-primary-800 transition-colors group-hover:text-secondary-600">
                    nosepinhouse2068@gmail.com
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sukrapth-24%2C%20New%20Road%2C%20Kathmandu%2C%20Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 transition-colors group-hover:bg-secondary-200">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
                      Location
                    </p>

                    <p className="mt-1 text-base leading-7 text-primary-800">
                      New Road, Kathmandu, Nepal
                    </p>
                  </div>
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                  <Clock3 size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary-600">
                    Customer Support
                  </p>

                  <p className="mt-1 text-base leading-7 text-primary-800">
                    Sunday – Friday
                    <br />
                    8:00 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-10 border-t border-primary-200/70 pt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary-600">
                Follow NOSEPINHOUSE
              </p>

              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/nosepinhouse1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow NOSEPINHOUSE on Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-300 text-primary-700 transition-all hover:border-secondary-500 hover:bg-secondary-500 hover:text-white"
                >
                  <FaInstagram size={18} />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/NosePinHouse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow NOSEPINHOUSE on Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-300 text-primary-700 transition-all hover:border-secondary-500 hover:bg-secondary-500 hover:text-white"
                >
                  <FaFacebookF size={17} />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/9779861252006"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with NOSEPINHOUSE on WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-300 text-primary-700 transition-all hover:border-secondary-500 hover:bg-secondary-500 hover:text-white"
                >
                  <FaWhatsapp size={19} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-sm border border-secondary-200/70 bg-white p-6 shadow-soft sm:p-9 lg:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
                Send Us A Message
              </p>

              <h2 className="mt-3 font-serif text-3xl text-primary-800 sm:text-4xl">
                How can we help?
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-primary-800"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-sm border border-primary-200 bg-background px-4 py-3.5 text-sm text-primary-900 outline-none transition-all placeholder:text-primary-400 focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-primary-800"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-sm border border-primary-200 bg-background px-4 py-3.5 text-sm text-primary-900 outline-none transition-all placeholder:text-primary-400 focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-primary-800"
                >
                  Phone Number
                  <span className="ml-1 text-xs font-normal text-primary-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  className="w-full rounded-sm border border-primary-200 bg-background px-4 py-3.5 text-sm text-primary-900 outline-none transition-all placeholder:text-primary-400 focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-primary-800"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="w-full rounded-sm border border-primary-200 bg-background px-4 py-3.5 text-sm text-primary-900 outline-none transition-all focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
                >
                  <option value="" disabled>
                    What can we help you with?
                  </option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Inquiry</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="return">Returns & Exchange</option>
                  <option value="other">Something Else</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-primary-800"
                >
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-sm border border-primary-200 bg-background px-4 py-3.5 text-sm text-primary-900 outline-none transition-all placeholder:text-primary-400 focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary-700 px-7 py-4 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-800 hover:shadow-soft-lg"
              >
                Send Message
                <Send
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p className="text-center text-xs leading-5 text-primary-500">
                We usually respond within one business day.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="bg-primary-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
            Need Help With Something Specific?
          </p>

          <h2 className="mt-3 font-serif text-4xl text-primary-800 sm:text-5xl">
            We&apos;re here for you.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {/* FAQ */}
            <Link
              href="/faq"
              className="group border border-secondary-200/70 bg-background p-8 text-left transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <MessageCircle
                size={27}
                strokeWidth={1.5}
                className="text-secondary-600"
              />

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Frequently Asked Questions
              </h3>

              <p className="mt-3 text-sm leading-7 text-primary-700/65">
                Find quick answers to common questions about orders, products,
                delivery, and more.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary-600">
                Visit FAQ
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* Shop */}
            <Link
              href="/jewellery"
              className="group border border-secondary-200/70 bg-background p-8 text-left transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span className="font-serif text-3xl text-secondary-600">♢</span>

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Explore Jewellery
              </h3>

              <p className="mt-3 text-sm leading-7 text-primary-700/65">
                Looking for something beautiful? Explore our collection and
                discover your next favourite piece.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary-600">
                Shop Now
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* Support */}
            <a
              href="mailto:hello@nosepinhouse.com"
              className="group border border-secondary-200/70 bg-background p-8 text-left transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <Mail
                size={27}
                strokeWidth={1.5}
                className="text-secondary-600"
              />

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Customer Support
              </h3>

              <p className="mt-3 text-sm leading-7 text-primary-700/65">
                Still have questions? Send us an email and our team will be
                happy to assist you.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary-600">
                Email Us
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-background px-6 py-24 text-center sm:px-8 sm:py-28">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
          NOSEPINHOUSE
        </p>

        <h2 className="mx-auto max-w-2xl font-serif text-4xl leading-tight text-primary-800 sm:text-5xl">
          Beautiful jewellery.
          <span className="block italic text-secondary-600">
            Personal stories.
          </span>
        </h2>

        <div className="mt-8">
          <Link
            href="/jewellery"
            className="inline-flex items-center gap-3 rounded-full bg-secondary-500 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-all hover:bg-secondary-600 hover:shadow-soft-lg"
          >
            Discover Your Piece
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
