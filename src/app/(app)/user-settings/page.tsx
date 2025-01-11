import UserSettingsForm from './_components/user-settings-form'

export default function UserSettingsPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Configurações da Conta</h1>
      <div className="bg-card text-card-foreground shadow rounded-lg">
        <div className="p-6 sm:p-8">
          <UserSettingsForm />
        </div>
      </div>
    </div>
  )
}
