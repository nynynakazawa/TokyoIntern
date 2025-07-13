"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobFormInput } from "../../../../../lib/validation/jobSchema";
import { createJob } from "../../../../../lib/serverActions/jobActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../../../../../components/ImageUpload";

function JobCreateForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyId,
      thumbnail: "",
      area: "",
      occupation: "",
      companyLogo: "",
      companyName: "",
    },
  });

  const onSubmit = async (data: JobFormInput) => {
    const jobData = {
      ...data,
      companyId, // 必ずcompanyIdを送信
      thumbnail: thumbnailUrl,
      createdAt: new Date().toISOString(),
    };
    await createJob(jobData);
    router.push("/company/jobs");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">新規求人作成</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register("companyId")} value={companyId} />
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
            <label className="block font-bold mb-1">給与<span className="text-red-500">*</span></label>
            <Input {...register("wage")} placeholder="例: 時給1000円" />
            {errors.wage && <p className="text-red-500 text-sm">{errors.wage.message}</p>}
          </div>
          <div>
            <label className="block font-bold mb-1">勤務地</label>
            <Input {...register("area")} placeholder="例: 渋谷区" />
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">職種</label>
          <Input {...register("occupation")} placeholder="例: エンジニア" />
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
        <ImageUpload onImageUpload={setThumbnailUrl} />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/company/jobs")}
          >
            キャンセル
          </Button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "送信中..." : "登録"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function JobCreatePage() {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdTokenResult();
        setCompanyId(typeof token.claims.companyId === "string" ? token.claims.companyId : null);
      }
    };
    fetchCompanyId();
  }, []);

  if (!companyId) return <div>企業情報を取得中...</div>;

  return <JobCreateForm companyId={companyId} />;
}
