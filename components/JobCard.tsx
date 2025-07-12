import Link from "next/link";

/** モック用 Job 型 */
export interface Job {
  id: string;
  title: string;
  area: string;
  occupation: string;
  wage: string;
  thumbnail?: string;
  company: { id: string; name: string; logo?: string };
}

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* サムネイル */}
      <div className="relative h-40 bg-gray-200">
        <img
          src={job.thumbnail ?? "/noimage.png"}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 本文 */}
      <div className="flex flex-1 flex-col p-3">
        <ul className="mb-2 flex flex-wrap gap-1">
          <li className="badge">{job.area}</li>
          <li className="badge">{job.occupation}</li>
        </ul>

        <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-main-600">
          {job.title}
        </h3>

        <p className="mb-4 text-sm text-gray-500">時給 ¥{job.wage.toLocaleString()}</p>

        {/* 会社 */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <img
            src={job.company.logo ?? "/logo.svg"}
            alt=""
            className="h-8 w-8 rounded-full border"
          />
          <p className="truncate text-xs">{job.company.name}</p>
        </div>
      </div>
    </Link>
  );
}

/* globals.css 例
.badge { @apply inline-block rounded bg-main-100 px-2 py-0.5 text-xs font-semibold text-main-600; }
*/