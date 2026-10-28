import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type EducationRow = {
  id: string;
  qualification: string;
  institution: string;
  field_of_study: string | null;
};

export default async function AdminEducation() {
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
    .from("education")
    .select("*")
    .order("sort_order");

  const educationRows = (rows ?? []) as EducationRow[];

  return (
    <section className="admin-shell">
      <div className="admin-panel">
        <span className="eyebrow">CMS · Education</span>
        <h1>Education</h1>
        <p className="muted">
          Education records are stored in PostgreSQL. Add and edit support is
          the next CMS extension; update the initial seed/migration or database
          records in Supabase for now.
        </p>
        <div className="admin-list">
          {educationRows.map((r) => (
            <div className="admin-row" key={r.id}>
              <div>
                <strong>{r.qualification}</strong>
                <div className="muted">
                  {r.institution} · {r.field_of_study || ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}