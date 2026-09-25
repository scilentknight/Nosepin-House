import Image from "next/image";
import Link from "next/link";
import { Gem, Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[620px] overflow-hidden lg:min-h-[700px]">
        <Image
          src="/images/about/about-hero.jpeg"
          alt="NOSEPINHOUSE jewellery collection"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/55 to-transparent" />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 sm:px-8 lg:min-h-[700px] lg:px-12">
          <div className="max-w-2xl text-white">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-secondary-300">
              The Story Behind NOSEPINHOUSE
            </p>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Jewellery that tells
              <span className="block italic text-secondary-300">
                your story.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-primary-50/90 sm:text-lg">
              At NOSEPINHOUSE, we believe jewellery is more than something
              beautiful to wear. It is a reflection of personality, a keeper of
              memories, and a small detail that can make an ordinary moment feel
              extraordinary.
            </p>

            <div className="mt-9">
              <Link
                href="/jewellery"
                className="group inline-flex items-center gap-3 rounded-full bg-secondary-500 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-secondary-600 hover:shadow-soft-lg"
              >
                Explore Our Collection
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
            About NOSEPINHOUSE
          </p>

          <h2 className="font-serif text-4xl leading-tight text-primary-800 sm:text-5xl">
            Where elegance meets
            <span className="italic text-secondary-600"> individuality.</span>
          </h2>

          <div className="mx-auto mt-7 max-w-3xl space-y-5 text-base leading-8 text-primary-700/75 sm:text-lg">
            <p>
              NOSEPINHOUSE was created with a simple idea: beautiful jewellery
              should feel personal. Every piece should complement the person
              wearing it, whether it is chosen for a celebration, a special
              occasion, or simply because it makes you feel beautiful.
            </p>

            <p>
              We bring together timeless elegance and contemporary design to
              create jewellery that feels refined, wearable, and meaningful.
              From delicate everyday pieces to statement designs, our collection
              is made for moments both big and small.
            </p>
          </div>

          <div className="mx-auto mt-5 h-px w-50 bg-secondary-400" />
        </div>
      </section>

      {/* Image + Story */}
      <section className="bg-primary-50/60 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          {/* Image */}
          <div className="relative">
            <div className="absolute -bottom-5 -left-5 h-32 w-32 border border-secondary-400/40 sm:h-40 sm:w-40" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              {/* 1536 × 1024 pixels. (w x h) */}
              <Image
                src="/images/about/about-story.png"
                alt="NOSEPINHOUSE jewellery craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary-500 text-center text-xs font-medium uppercase tracking-widest text-white shadow-soft-lg sm:h-28 sm:w-28">
              Crafted
              <br />
              With
              <br />
              Care
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
              Our Philosophy
            </p>

            <h2 className="font-serif text-4xl leading-tight text-primary-800 sm:text-5xl">
              Beauty is in the
              <span className="block italic text-secondary-600">
                little details.
              </span>
            </h2>

            <div className="mt-7 space-y-5 text-base leading-8 text-primary-700/75">
              <p>
                We carefully curate every piece with an appreciation for
                timeless beauty and modern expression. Our goal is not simply to
                follow trends, but to help you discover jewellery that feels
                naturally yours.
              </p>

              <p>
                Whether it becomes part of your everyday style or accompanies
                you on an unforgettable occasion, we want every NOSEPINHOUSE
                piece to become part of your story.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-secondary-500" />
              <span className="font-serif text-lg italic text-primary-700">
                Made to be remembered.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
              What We Believe
            </p>

            <h2 className="font-serif text-4xl text-primary-800 sm:text-5xl">
              More than jewellery.
            </h2>

            <p className="mt-5 leading-7 text-primary-700/70">
              Every part of NOSEPINHOUSE is guided by the values that shape the
              way we design, curate, and serve our customers.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-secondary-200/60 bg-secondary-200/60 md:grid-cols-3">
            {/* Value 1 */}
            <div className="bg-background px-8 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                <Gem size={25} strokeWidth={1.5} />
              </div>

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Timeless Beauty
              </h3>

              <p className="mt-4 text-sm leading-7 text-primary-700/70">
                Designs chosen to remain elegant beyond passing trends and
                become a lasting part of your personal style.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-background px-8 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                <Heart size={25} strokeWidth={1.5} />
              </div>

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Made Personal
              </h3>

              <p className="mt-4 text-sm leading-7 text-primary-700/70">
                Jewellery should feel like you. We celebrate individuality,
                self-expression, and the stories behind every purchase.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-background px-8 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                <Sparkles size={25} strokeWidth={1.5} />
              </div>

              <h3 className="mt-6 font-serif text-2xl text-primary-800">
                Thoughtfully Chosen
              </h3>

              <p className="mt-4 text-sm leading-7 text-primary-700/70">
                We focus on pieces that combine beauty, versatility, and
                thoughtful design for modern jewellery lovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="relative overflow-hidden bg-primary-900 py-20 text-white sm:py-28">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-secondary-400/20" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-secondary-400/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-300">
              The NOSEPINHOUSE Standard
            </p>

            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
              Details matter.
              <span className="block italic text-secondary-300">
                Quality matters more.
              </span>
            </h2>

            <p className="mt-7 max-w-xl leading-8 text-primary-100/80">
              From the way a piece catches the light to the way it feels when
              you wear it, we believe the details make the difference. We aim to
              offer jewellery that looks beautiful, feels special, and becomes
              something you reach for again and again.
            </p>

            <div className="mt-9">
              <Link
                href="/jewellery"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-secondary-300"
              >
                Discover the collection
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src="/images/about/about-detail-1.jpg"
                alt="NOSEPINHOUSE jewellery detail"
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>

            <div className="relative mt-12 aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src="/images/about/about-detail-2.jpg"
                alt="NOSEPINHOUSE jewellery detail"
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:px-8 md:grid-cols-3">
          <div className="flex items-center justify-center gap-4 text-center md:justify-start md:text-left">
            <ShieldCheck
              size={30}
              strokeWidth={1.5}
              className="shrink-0 text-secondary-600"
            />
            <div>
              <h3 className="font-serif text-lg text-primary-800">
                Quality Focused
              </h3>
              <p className="mt-1 text-xs text-primary-700/60">
                Carefully selected pieces
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-center md:justify-start md:text-left">
            <Gem
              size={30}
              strokeWidth={1.5}
              className="shrink-0 text-secondary-600"
            />
            <div>
              <h3 className="font-serif text-lg text-primary-800">
                Elegant Designs
              </h3>
              <p className="mt-1 text-xs text-primary-700/60">
                Designed for your style
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-center md:justify-start md:text-left">
            <Heart
              size={30}
              strokeWidth={1.5}
              className="shrink-0 text-secondary-600"
            />
            <div>
              <h3 className="font-serif text-lg text-primary-800">
                Customer First
              </h3>
              <p className="mt-1 text-xs text-primary-700/60">
                Your experience matters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background px-6 py-24 text-center sm:px-8 sm:py-32">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-secondary-600">
          Find Something Beautiful
        </p>

        <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-primary-800 sm:text-5xl lg:text-6xl">
          Your next favourite piece
          <span className="block italic text-secondary-600">
            is waiting for you.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-7 text-primary-700/70">
          Explore the NOSEPINHOUSE collection and discover jewellery made to
          become part of your everyday moments and special memories.
        </p>

        <div className="mt-9">
          <Link
            href="/jewellery"
            className="inline-flex items-center gap-3 rounded-full bg-primary-700 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-800 hover:shadow-soft-lg"
          >
            Shop Jewellery
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
