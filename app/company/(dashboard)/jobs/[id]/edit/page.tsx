"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../../../../lib/firebaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobFormInput } from "../../../../../../lib/validation/jobSchema";
import { updateJob } from "../../../../../../lib/serverActions/jobActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../../../../../../components/ImageUpload";
import AreaFilter from "../../../../../../components/Filters/AreaFilter";
import OccupationFilter from "../../../../../../components/Filters/OccupationFilter";

export default function JobEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [jobCompanyId, setJobCompanyId] = useState<string>("");

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
        setJobCompanyId(data.companyId || "");
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, setValue]);

  const onSubmit = async (data: JobFormInput) => {
    await updateJob(id as string, { ...data, thumbnail: thumbnailUrl });
    router.push("/company/jobs");
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">求人編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-bold mb-1">タイトル<span className="text-red-500">*</span></label>
          <Input {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-bold mb-1">仕事内容<span className="text-red-500">*</span></label>
          <Textarea {...register("description")} rows={4} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">給与下限<span className="text-red-500">*</span></label>
            <Input type="number" step="any" {...register("wageMin", { valueAsNumber: true })} placeholder="例: 1000" />
            {errors.wageMin && <p className="text-red-500 text-sm">{errors.wageMin.message}</p>}
          </div>
          <div>
            <label className="block font-bold mb-1">給与上限</label>
            <Input type="number" step="any" {...register("wageMax", { valueAsNumber: true })} placeholder="例: 2000" />
            {errors.wageMax && <p className="text-red-500 text-sm">{errors.wageMax.message}</p>}
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">勤務地</label>
          <AreaFilter
            value={watch("area") ?? ""}
            onChange={(v: string) => setValue("area", v, { shouldValidate: true })}
          />
          {errors.area && <p className="text-red-500 text-sm">{errors.area.message}</p>}
        </div>
        <div>
          <label className="block font-bold mb-1">職種</label>
          <OccupationFilter value={watch("occupation") ?? ""} onChange={v => setValue("occupation", v, { shouldValidate: true })} />
          {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation.message}</p>}
        </div>
        <div>
          <label className="block font-bold mb-1">条件</label>
          <Input {...register("conditions")} placeholder="例: 大学生歓迎" />
        </div>
        <div>
          <label className="block font-bold mb-1">業務内容</label>
          <Textarea {...register("duties")} rows={3} placeholder="具体的な業務内容を記載してください" />
        </div>
        <div>
          <label className="block font-bold mb-1">備考</label>
          <Textarea {...register("notes")} rows={3} placeholder="その他の情報があれば記載してください" />
        </div>
        <ImageUpload onImageUpload={setThumbnailUrl} currentImageUrl={thumbnailUrl} mode="job-thumbnail" companyId={jobCompanyId} />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/company/jobs")}
          >
            キャンセル
          </Button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "送信中..." : "更新"}
          </button>
        </div>
      </form>
    </div>
  );
} 