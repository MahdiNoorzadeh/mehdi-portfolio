import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  saveExperience,
  deleteExperience,
} from "@/app/admin/actions";

type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string;
  status: "draft" | "published" | "archived";
};

type ExperienceFormProps = {
  action: (form: FormData) => void | Promise<void>;
  row?: ExperienceRow;
};

export default async function AdminExperience({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    saved?: string;
    deleted?: string;
  }>;
}) {
  const q = await searchParams;
  const db = await createClient();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await db
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=1");

  const { data: rows } = await db
    .from("experience")
    .select("*")
    .order("sort_order");

  const experienceRows = (rows ?? []) as ExperienceRow[];

  return (
    <section className="admin-shell">
      <div className="admin-panel">
        <span className="eyebrow">CMS · Experience</span>
        <h1>Work experience</h1>

        {q.saved && <p className="notice">Experience saved.</p>}
        {q.error && (
          <p className="notice">
            Could not save. Verify dates and required fields.
          </p>
        )}

        <ExperienceForm action={saveExperience} />

        <div className="admin-list">
          {experienceRows.map((r) => (
            <details key={r.id} className="skill-group">
              <summary style={{ cursor: "pointer" }}>
                {r.role} · {r.company} ({r.status})
              </summary>

              <ExperienceForm action={saveExperience} row={r} />

              <form action={deleteExperience}>
                <input type="hidden" name="id" value={r.id} />
                <button className="small-button danger" type="submit">
                  Delete
                </button>
              </form>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceForm({ action, row }: ExperienceFormProps) {
  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="id" value={row?.id || ""} />

      <label>
        Company
        <input name="company" required defaultValue={row?.company || ""} />
      </label>

      <label>
        Role
        <input name="role" required defaultValue={row?.role || ""} />
      </label>

      <label>
        Location
        <input name="location" defaultValue={row?.location || ""} />
      </label>

      <label>
        Start date
        <input
          type="date"
          name="start_date"
          required
          defaultValue={row?.start_date || ""}
        />
      </label>

      <label>
        End date (optional)
        <input
          type="date"
          name="end_date"
          defaultValue={row?.end_date || ""}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          required
          defaultValue={row?.description || ""}
        />
      </label>

      <label>
        Status
        <select name="status" defaultValue={row?.status || "published"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>

      <button className="button" type="submit">
        {row ? "Save experience" : "Add experience"}
      </button>
    </form>
  );
}