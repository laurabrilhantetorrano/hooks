REFATORAÇÃO DO HOOK useTasks.ts

1. Problemas identificados

- Código duplicado em createTask e updateTask
- Repetição de chamadas fetch
- Funções recriadas a cada renderização
- Recarregamento completo da lista após alterações

2. Soluções aplicadas

- Criação da função apiRequest para centralizar requisições HTTP
- Criação da função handleSubmit para reutilização do tratamento de erros e estados
- Uso de useCallback para otimização de performance
- Implementação de atualização otimista do estado local

3. Benefícios das melhorias

- Código mais limpo e organizado
- Menor repetição
- Melhor reutilização
- Melhor manutenção
- Melhor performance
- Redução de requisições desnecessárias

4. Separação de responsabilidades

A lógica de comunicação com a API foi parcialmente centralizada na função apiRequest, reduzindo acoplamento e facilitando manutenção futura. Em projetos maiores, seria interessante mover essa lógica para um arquivo separado de services.