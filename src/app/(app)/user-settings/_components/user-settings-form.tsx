'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/hooks/use-user'
import { Loader2 } from 'lucide-react'
import { UserSettingsFormLoading } from './user-settings-form-loading'
import { useDebounce } from '@/hooks/use-debounce'
import { userProfileSchema } from '@/schemas/user.schema'
import { useServerActionMutation } from '@/hooks/server-action-hooks'
import { updateUserProfileAction } from '@/services/actions/user.action'
import { toast } from 'sonner'

const formSchema = userProfileSchema

export default function UserSettingsForm() {
  const { user, isPending, updateInfoInfo } = useUser()
  const [avatarUrl, setAvatarUrl] = useState(
    '/placeholder.svg?height=100&width=100',
  )

  const { mutate, isPending: isSubmitting } = useServerActionMutation(
    updateUserProfileAction,
    {
      onSuccess: () => {
        updateInfoInfo()
        toast.success('Perfil atualizado com sucesso!')
      },
      onError: (error) => {
        toast.error('Erro ao atualizar o perfil!', {
          description: error.formattedErrors?._errors.join(', '),
        })
      },
    },
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      monthlySalary: user?.monthlySalary ?? 0,
      imageUrl: user?.image || '',
    },
  })
  const watchImageUrl = form.watch('imageUrl')
  const debouncedImageUrl = useDebounce(watchImageUrl, 300)

  function handleSetDefaultValuesToFormAfterUserDataHasLoaded() {
    form.setValue('name', user!.name)
    form.setValue('monthlySalary', user!.monthlySalary ?? 0)
    form.setValue('imageUrl', user!.image ?? '')
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      name: values.name,
      monthlySalary: values.monthlySalary,
      imageUrl: values.imageUrl,
    })
  }

  useEffect(() => {
    if (debouncedImageUrl && debouncedImageUrl.trim() !== '') {
      setAvatarUrl(debouncedImageUrl)
    } else {
      setAvatarUrl('/placeholder.svg?height=100&width=100')
    }
  }, [debouncedImageUrl])

  useEffect(() => {
    if (user) {
      handleSetDefaultValuesToFormAfterUserDataHasLoaded()
    }
  }, [user])

  if (isPending || !user) {
    return <UserSettingsFormLoading />
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais e configurações de conta.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 sm:space-y-0 sm:flex sm:items-center sm:space-x-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel className="text-base">Foto de Perfil</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={avatarUrl} alt="Avatar" />
                        <AvatarFallback>
                          {user.name
                            ?.split(' ')
                            .map((name) => name[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        placeholder="URL da imagem de perfil"
                        {...field}
                        className="max-w-xs"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-center max-w-xs">
                    Insira a URL de uma imagem para usar como foto de perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-6 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        {...field}
                        className="max-w-md"
                      />
                    </FormControl>
                    <FormDescription>
                      Este é o seu nome de exibição em todo o sistema.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlySalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Renda Mensal</FormLabel>
                    <FormControl>
                      <div className="relative max-w-md">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          R$
                        </span>
                        <Input
                          type="number"
                          placeholder="0,00"
                          {...field}
                          className="pl-8"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Informe sua renda mensal em reais. Esta informação é
                      confidencial.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              {isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
