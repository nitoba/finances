'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type * as z from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Separator } from '@/components/ui/separator'
import { useServerActionMutation } from '@/hooks/server-action-hooks'
import { useDebounce } from '@/hooks/use-debounce'
import { useUser } from '@/hooks/use-user'
import { userProfileSchema } from '@/schemas/user.schema'
import { updateUserProfileAction } from '@/services/actions/user.action'
import { UserSettingsFormLoading } from './user-settings-form-loading'

const formSchema = userProfileSchema

export default function UserSettingsForm() {
  const { user, isPending, updateInfoInfo } = useUser()
  const [avatarUrl, setAvatarUrl] = useState(
    '/placeholder.svg?height=100&width=100'
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
    }
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

  function onSubmit(values: z.infer<typeof formSchema>) {
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
        <h3 className="font-medium text-lg">Configurações do Perfil</h3>
        <p className="text-muted-foreground text-sm">
          Atualize suas informações pessoais e configurações de conta.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8 sm:flex sm:items-center sm:space-x-8 sm:space-y-0">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel className="text-base">Foto de Perfil</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage alt="Avatar" src={avatarUrl} />
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
                  <FormDescription className="max-w-xs text-center">
                    Insira a URL de uma imagem para usar como foto de perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1 space-y-6">
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
                        <span className="-translate-y-1/2 absolute top-1/2 left-3 transform text-muted-foreground">
                          R$
                        </span>
                        <Input
                          placeholder="0,00"
                          type="number"
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
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              type="submit"
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
