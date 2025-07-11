import UserSettingsForm from './_components/user-settings-form'

export default function UserSettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-bold text-3xl">Configurações da Conta</h1>
      <div className="rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="p-6 sm:p-8">
          <UserSettingsForm />
        </div>
      </div>
    </div>
  )
}
