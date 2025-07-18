export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Client Details</h1>
      <p>Details for client with ID: {params.id}</p>
    </div>
  );
}
