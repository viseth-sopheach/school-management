import { createClass } from "../../api/adminApi";
import CreateClassForm from "../../components/admin/CreateClassForm";

export default function AdminClassesPage() {
  const handleCreate = async (data) => {
    await createClass(data);
  };

  return (
    <div className="page">
      <h1>Classes</h1>
      <CreateClassForm onCreate={handleCreate} />
      <p className="hint">
        A list of existing classes isn't available yet — the API has no GET
        endpoint for classes.
      </p>
    </div>
  );
}
