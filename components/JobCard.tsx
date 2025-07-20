import Link from "next/link";
import { Job } from "@/hook/useJobs";

export default function JobCard({ job }: { job: Job }) {
  const handleCompanyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.companyId) {
      window.location.href = `/companies/${job.companyId}`;
    }
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* サムネイル */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
        <img
          src={job.thumbnail ?? "/noimage.png"}
          alt="サムネイル"
          className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>

      {/* 本文 */}
      <div className="flex flex-1 flex-col p-3">
        {/* area, occupationはFirestoreに無ければ省略 */}
        <ul className="mb-2 flex flex-wrap gap-1">
          {job.area && <li className="badge">{job.area}</li>}
          {job.occupation && <li className="badge">{job.occupation}</li>}
        </ul>

        <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-main-600">
          {job.title}
        </h3>

        <p className="mb-4 text-sm text-gray-500">
          {job.wageMax ?
            `時給 ¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
            `時給 ¥${job.wageMin.toLocaleString()}`
          }
        </p>

        {/* 会社名（companyNameやcompanyIdがあれば表示） */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          {job.companyLogo && (
            <img
              src={job.companyLogo}
              alt=""
              className="h-8 w-8 rounded-full border object-cover"
            />
          )}
          {job.companyName && job.companyId ? (
            <button
              onClick={handleCompanyClick}
              className="truncate text-xs text-main-600 hover:text-main-700 hover:underline transition-colors"
            >
              {job.companyName}
            </button>
          ) : (
            <p className="truncate text-xs text-gray-500">{job.companyName || ""}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

/* globals.css 例
.badge { @apply inline-block rounded bg-main-100 px-2 py-0.5 text-xs font-semibold text-main-600; }
*/