import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare 
} from "lucide-react";
import { projectsData } from "@/modules/projects";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Design Nayan Portfolio`,
    description: project.overview,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white select-none pb-20 font-sans">
      {/* Top Banner */}
      <section className="bg-neutral-950 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="space-y-3">
            <span className="px-3 py-1 rounded-md bg-rose-600 text-white text-[10px] sm:text-xs font-bold font-mono uppercase">
              {project.categoryTag}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 space-y-12">
        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-[16/10] bg-neutral-100">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Specs Pill Bar */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-neutral-50 p-4 sm:p-6 rounded-3xl border border-neutral-200 text-center">
          <div>
            <div className="text-xs text-neutral-500 uppercase font-mono">Area / Scale</div>
            <div className="text-sm sm:text-base font-bold text-neutral-950 font-mono mt-1">{project.area}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 uppercase font-mono">Year Completed</div>
            <div className="text-sm sm:text-base font-bold text-neutral-950 font-mono mt-1">{project.year}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 uppercase font-mono">Client Type</div>
            <div className="text-sm sm:text-base font-bold text-neutral-950 mt-1 truncate">{project.client}</div>
          </div>
        </div>

        {/* Overview & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
              About This Project
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {project.overview}
            </p>
          </div>

          <div className="md:col-span-5 bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
              Key Highlights
            </h3>
            <div className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {project.gallery && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Contact Box: Horizontal side-by-side buttons on mobile */}
        <div className="p-6 sm:p-12 rounded-3xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-bold text-rose-500 uppercase font-mono tracking-wider">
              INSPIRED BY THIS DESIGN?
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              Let&apos;s build your dream project together.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">
              Get in touch with our team for custom layouts, 3D renderings, and Nayan Constructions execution.
            </p>
          </div>

          <div className="flex flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/918472934031?text=${encodeURIComponent(
                `Hi Design Nayan! I am interested in building a project similar to *${project.title}* (${project.categoryTag}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              href={`/contact?service=${encodeURIComponent(project.categoryTag)}&project=${encodeURIComponent(project.title)}`}
              className="flex-1 md:flex-none px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
