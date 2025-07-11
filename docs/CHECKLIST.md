# Checklist de Desenvolvimento

Antes de iniciar qualquer trabalho, revise este checklist obrigatório.

### 1. Preparação da Tarefa

- **Gerenciamento:** Utilize o Task Master para gerenciar as tarefas.
- **Branch:** Se for a primeira subtarefa de uma tarefa principal, crie uma nova branch a partir da `main` usando o padrão `task/<task-number>-<task-name>`.
- **Status:** Marque a subtarefa e a tarefa principal como `in-progress`.

### 2. Desenvolvimento e Qualidade

- **Verificação de Tipos:** Execute `pnpm run typecheck` para garantir a segurança de tipos.
- **Linting:** Rode `pnpm run lint` para verificar o estilo do código e `pnpm run lint:fix` para correções automáticas.
- **Correções:** Corrija todos os erros antes de continuar. Warnings podem ser analisados caso a caso.

### 3. Finalização da Tarefa

- **Commit:** Faça um commit claro e descritivo das suas alterações.
- **Stage:** Use `git add .` para adicionar todas as alterações.
- **Verificação Final:** Execute novamente `pnpm run typecheck`, `pnpm run lint`
- **Status da Subtarefa:** Marque a subtarefa como `done`.
- **Pull Request:** Após a conclusão de todas as subtarefas, marque a tarefa principal como `done`. Em seguida, crie um Pull Request para a `main` utilizando o GitHub CLI (`gh`).

### 4. Design e Estilo

1.  Ao implementar as novas tasks e subtasks verifique o design para fazer um redesign dos items.
2.  Inspire-se em designs minimalistas e bonitos como o Linear e Vercel mas ainda usando componentes do shadcn/ui e originUI (https://originui.com)
