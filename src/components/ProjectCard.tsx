import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MessageSquare,
  ArrowLeft,
  MapPin,
  Maximize2,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { ProjectItem } from '@/types'
import { generateProjectWhatsAppUrl } from '@/utils/whatsapp'

interface ProjectCardProps {
  project: ProjectItem
  priority?: boolean
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const whatsappUrl = generateProjectWhatsAppUrl(
    project.title,
    project.category,
    project.location
  )

  const imgSrc = project.image || '/images/placeholder-project.jpg'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-[#c5a059]/40">
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
        aria-label={`عرض تفاصيل مشروع ${project.title}`}
      >
        <Image
          src={imgSrc}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute right-3 top-3 z-10">
          <span className="rounded-full bg-[#1a233a]/85 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold text-[#c5a059] shadow backdrop-blur-md">
            {project.category}
          </span>
        </div>

        <div className="absolute left-3 top-3 z-10">
          {project.status === 'ongoing' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-md">
              <Clock className="h-3 w-3" />
              قيد التنفيذ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-md">
              <CheckCircle2 className="h-3 w-3" />
              مكتمل
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
              <span>{project.location || 'جدة'}</span>
            </span>

            {project.area && (
              <span className="inline-flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5 text-[#c5a059]" />
                <span>{project.area}</span>
              </span>
            )}

            {project.completionYear && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#c5a059]" />
                <span>{project.completionYear}</span>
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#1a233a] transition-colors group-hover:text-[#c5a059] line-clamp-2 leading-snug">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
            {project.description}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-[11px] sm:text-xs font-bold text-gray-700 transition hover:bg-[#1a233a] hover:text-[#c5a059] hover:border-[#1a233a]"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`طلب تنفيذ مشروع ${project.title}`}
            className="inline-flex flex-[3] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] py-2.5 text-[11px] sm:text-xs font-bold text-[#1a233a] shadow-sm transition hover:brightness-105"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </article>
  )
}