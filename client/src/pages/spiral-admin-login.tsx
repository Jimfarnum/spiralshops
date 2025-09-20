export default function AdminLogin() {
  const onSubmit = (e: any) => {
    e.preventDefault();
    // TODO: replace with IBM App ID/OIDC
    window.location.href = "/admin";
  };
  return (
    <main style={{ padding: 16 }}>
      <h1>SPIRAL Admin</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input type="email" placeholder="admin@spiralshops.com" required />
        <input type="password" placeholder="password" required />
        <button type="submit" style={{ padding: "10px 12px" }}>Login</button>
      </form>
    </main>
  );
}