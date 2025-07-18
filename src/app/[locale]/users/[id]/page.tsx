export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">User Details</h1>
      <p>Details for user with ID: {params.id}</p>
    </div>
  );
}
