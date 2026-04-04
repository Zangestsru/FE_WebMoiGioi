import { useState, useEffect } from "react";
import { projectApi, type ProjectSummary } from "../api/project.api";

export function useProjectDetail(id: string | undefined) {
  const [project, setProject] = useState<ProjectSummary & { listings?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await projectApi.getPublicProjectById(id);
        if (res.success) {
          setProject(res.data);
          console.log("project detail: ", res.data);
        } else {
          setError(res.message || "Lỗi tải chi tiết dự án");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { project, loading, error };
}
