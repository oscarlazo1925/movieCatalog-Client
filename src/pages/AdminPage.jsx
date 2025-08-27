import MoviesTable from "../components/MoviesTable";

function AdminPage() {
  const user = { role: "admin", name: "Super Admin" }; // mock user

  return <MoviesTable user={user} />;
}

export default AdminPage;