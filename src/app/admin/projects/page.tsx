import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  saveProject,
  deleteProject,
} from "@/app/admin/actions";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  technologies: string[] | null;
  repository_url: string;
  demo_url: string | null;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  challenges: string | null;
  outcomes: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
};

type ProjectFormProps = {
  action: (form: FormData) => void | Promise<void>;
  project?: ProjectRow;
};

export default async function AdminProjects({
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

  const { data: projects } = await db
    .from("projects")
    .select("*")
    .order("sort_order");

  const projectRows = (projects ?? []) as ProjectRow[];

  return (
    <section className="admin-shell">
      <div className="admin-panel">
        <span className="eyebrow">CMS · Projects</span>
        <h1>Manage projects</h1>
        <p className="muted">
          Create, edit, publish, archive, or remove project case studies.
          Changes are saved to PostgreSQL.
        </p>

        {q.saved && <p className="notice">Project saved.</p>}
        {q.deleted && <p className="notice">Project deleted.</p>}
        {q.error && (
          <p className="notice">
            Unable to save. Check required fields, slug uniqueness, URLs, and
            database migration.
          </p>
        )}

        <div className="admin-list">
          {projectRows.map((p) => (
            <div className="admin-row" key={p.id}>
              <div>
                <strong>{p.title}</strong>
                <div className="muted">
                  /{p.slug} · {p.status}
                  {p.featured ? " · Featured" : ""}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <a className="small-button" href={`#edit-${p.id}`}>
                  Edit
                </a>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="small-button danger" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <h2 id="new-project" style={{ marginTop: 35 }}>
          Add project
        </h2>

        <ProjectForm action={saveProject} />

        {projectRows.map((p) => (
          <details
            id={`edit-${p.id}`}
            key={p.id}
            style={{ marginTop: 20 }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>
              Edit {p.title}
            </summary>
            <ProjectForm action={saveProject} project={p} />
          </details>
        ))}
      </div>
    </section>
  );
}

function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="id" value={project?.id || ""} />

      <label>
        Title
        <input
          name="title"
          required
          minLength={2}
          defaultValue={project?.title || ""}
        />
      </label>

      <label>
        Slug
        <input
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={project?.slug || ""}
        />
      </label>

      <label>
        Summary
        <textarea
          name="summary"
          required
          minLength={10}
          defaultValue={project?.summary || ""}
        />
      </label>

      <label>
        Category
        <input
          name="category"
          required
          defaultValue={project?.category || "Backend"}
        />
      </label>

      <label>
        Technologies (comma-separated)
        <input
          name="technologies"
          defaultValue={(project?.technologies || []).join(", ")}
        />
      </label>

      <label>
        Repository URL
        <input
          name="repository_url"
          type="url"
          required
          defaultValue={
            project?.repository_url || "https://github.com/MahdiNoorzadeh/"
          }
        />
      </label>

      <label>
        Demo URL (optional)
        <input
          name="demo_url"
          type="url"
          defaultValue={project?.demo_url || ""}
        />
      </label>

      <label>
        Problem
        <textarea name="problem" defaultValue={project?.problem || ""} />
      </label>

      <label>
        Solution
        <textarea name="solution" defaultValue={project?.solution || ""} />
      </label>

      <label>
        Architecture
        <textarea
          name="architecture"
          defaultValue={project?.architecture || ""}
        />
      </label>

      <label>
        Challenges
        <textarea
          name="challenges"
          defaultValue={project?.challenges || ""}
        />
      </label>

      <label>
        Outcomes
        <textarea name="outcomes" defaultValue={project?.outcomes || ""} />
      </label>

      <label>
        Status
        <select name="status" defaultValue={project?.status || "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>

      <label>
        <input
          style={{ width: "auto" }}
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured || false}
        />
        Featured on homepage
      </label>

      <button className="button" type="submit">
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}