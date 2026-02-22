interface Props {
  users: any[]
}

export default function TopUsers({ users }: Props) {
  return (
    <div className="bg-gray-100 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">
        Top 5 participantes
      </h3>

      <ul className="space-y-2">
        {users.map((u, index) => (
          <li key={u.createdById}>
            #{index + 1} - Usuário {u.createdById} ({u._count.createdById} bilhetes)
          </li>
        ))}
      </ul>
    </div>
  )
}