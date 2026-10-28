import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { saveSkill, deleteSkill } from "@/app/admin/actions";

type SkillRow = {
  id: string;
  name: string;
  category: string;
};

export default async function AdminSkills({
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
    .from("skills")
    .select("*")
    .order("category");

  const skillRows = (rows ?? []) as SkillRow[];

  return (
    <section className="admin-shell">
      <div className="admin-panel">
        <span className="eyebrow">CMS · Skills</span>
        <h1>Technical skills</h1>

        {q.saved && <p className="notice">Skill saved.</p>}
        {q.error && (
          <p className="notice">
            Could not save skill. Names must be unique.
          </p>
        )}

        <SkillForm action={saveSkill} />

        <div className="admin-list">
          {skillRows.map((r) => (
            <div className="admin-row" key={r.id}>
              <div>
                <strong>{r.name}</strong>
                <div className="muted">{r.category}</div>
              </div>

              <form action={deleteSkill}>
                <input type="hidden" name="id" value={r.id} />
                <button className="small-button danger" type="submit">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  
function SkillForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form className="admin-form" action={action}>
      <label>
        Skill name
        <input
          name="name"
          required
          minLength={1}
          placeholder="e.g. Spring Boot"
        />
      </label>

      <label>
        Category
        <input
          name="category"
          required
          minLength={1}
          placeholder="e.g. Backend"
        />
      </label>

      <button className="button" type="submit">
        Add skill
      </button>
    </form>
  );
}

}
