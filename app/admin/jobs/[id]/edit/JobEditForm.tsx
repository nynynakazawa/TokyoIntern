"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../../../lib/firebaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobFormInput } from "../../../../../lib/validation/jobSchema";
import { updateJob } from "../../../../../lib/serverActions/jobActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../../../../../components/ImageUpload";
import AreaFilter from "../../../../../components/Filters/AreaFilter";
import OccupationFilter from "../../../../../components/Filters/OccupationFilter";
import LoadingAnimation from "../../../../../components/LoadingAnimation";

export default function JobEditForm() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const [loading, setLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      const db = getFirestore(app);
      const ref = doc(db, "jobs", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof JobFormInput, value);
        });
        setThumbnailUrl(data.thumbnail || "");
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, setValue]);

  const onSubmit = async (data: JobFormInput) => {
    await updateJob(id as string, { ...data, thumbnail: thumbnailUrl });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/admin/jobs");
    }, 2000);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <main className="min-h-[60vh] flex flex-col items-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-3xl">
        <Button
          variant="outline"
          className="flex items-center gap-1 mb-6 hover:bg-gray-100"
          onClick={() => router.push("/admin/jobs")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          求人一覧に戻る
        </Button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-8 text-center text-main-700">求人編集</h1>
          {saved && <p className="text-green-600 text-center font-semibold mb-4">保存しました！</p>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タイトル<span className="text-red-500">*</span></label>
              <Input
                {...register("title")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">仕事内容<span className="text-red-500">*</span></label>
              <Textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">給与下限<span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  step="any"
                  {...register("wageMin", { valueAsNumber: true })}
                  placeholder="例: 1000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
                />
                {errors.wageMin && <p className="text-red-500 text-sm mt-1">{errors.wageMin.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">給与上限</label>
                <Input
                  type="number"
                  step="any"
                  {...register("wageMax", { valueAsNumber: true })}
                  placeholder="例: 2000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
                />
                {errors.wageMax && <p className="text-red-500 text-sm mt-1">{errors.wageMax.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
              <AreaFilter
                value={watch("area") ?? ""}
                onChange={(v: string) => setValue("area", v, { shouldValidate: true })}
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
              <OccupationFilter
                value={watch("occupation") ?? ""}
                onChange={v => setValue("occupation", v, { shouldValidate: true })}
              />
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">条件</label>
              <Input
                {...register("conditions")}
                placeholder="例: 大学生歓迎"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業務内容</label>
              <Textarea
                {...register("duties")}
                rows={3}
                placeholder="具体的な業務内容を記載してください"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
              <Textarea
                {...register("notes")}
                rows={3}
                placeholder="その他の情報があれば記載してください"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">サムネイル画像</label>
              <ImageUpload
                onImageUpload={setThumbnailUrl}
                currentImageUrl={thumbnailUrl}
                mode="job-thumbnail"
                companyId={companyId || ""}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/jobs")}
                className="px-6 hover:bg-gray-100"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-main-600 text-white px-6 hover:bg-main-700 transition active:scale-95"
              >
                {isSubmitting ? "送信中..." : "更新"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 