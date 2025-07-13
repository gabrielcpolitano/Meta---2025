# 🎯 Trilha de Certificados - Jornada do Desenvolvedor

Um site gamificado, moderno e responsivo para acompanhar a jornada de aprendizado e finalização de 27 certificados de programação até 31 de agosto de 2025.

## 🚀 Objetivo Final

**Sair do pedágio e começar a trabalhar como desenvolvedor freelancer ou CLT**

Meta: 31 de Agosto de 2025

## ✨ Funcionalidades

### 🎮 Interface Gamificada
- Design moderno com TailwindCSS
- Elementos visuais de jogos (barras de XP, conquistas, fases)
- Animações suaves e interatividade
- Layout totalmente responsivo

### 📊 Dashboard do Jogador
- **Certificados Concluídos**: Progresso visual (X/27)
- **XP Total**: 100 XP por certificado concluído
- **Nível do Usuário**: Sistema de níveis baseado em XP
  - Nível 1: Iniciante (0-499 XP)
  - Nível 2: Aprendiz (500-999 XP)
  - Nível 3: Desenvolvedor Jr (1000-1499 XP)
  - Nível 4: Desenvolvedor (1500-1999 XP)
  - Nível 5: Desenvolvedor Sr (2000-2499 XP)
  - Nível 6: Tech Lead (2500-2699 XP)
  - Nível 7: Arquiteto (2700+ XP)
- **Status do Ritmo**: Indicador inteligente de progresso

### 🏃‍♂️ Sistema de Ritmo Acumulativo (Pressão Crescente)

O sistema calcula automaticamente se você está no ritmo ideal baseado na fórmula:

**A cada 2 dias que passam, você deve ter 1 certificado a mais acumulado.**

#### Estados do Ritmo:
- ✅ **Adiantado**: Você tem mais certificados que o esperado
- 🟡 **Em Dia**: Você está exatamente no ritmo ideal
- ❌ **Atrasado**: Você precisa acelerar o ritmo

### ⏰ Contador Regressivo
- Exibe o tempo restante até 31 de agosto de 2025
- Atualização em tempo real
- Visual de urgência quando necessário

### 🏆 Sistema de Conquistas
- **🥉 Bronze**: 5 certificados
- **🥈 Prata**: 10 certificados
- **🥇 Ouro**: 20 certificados
- **💎 Diamante**: 27 certificados (conquista final)

Cada conquista é desbloqueada com animação especial e efeito de confete!

### 🛤️ Trilha de Progresso
- 27 etapas visuais representando cada certificado
- Certificados concluídos ficam verdes com ✅
- Certificados pendentes ficam cinza com o número
- Animações de pulsação para certificados concluídos

### 💾 Salvamento Automático
- Progresso salvo automaticamente no LocalStorage
- Dados persistem entre sessões do navegador
- Não perde o progresso ao fechar o site

## 🎮 Como Usar

### Adicionar Certificado
- Clique no botão **"✅ Certificado Concluído"**
- Ou use o atalho de teclado **"+"**

### Remover Certificado
- Clique no botão **"❌ Remover Certificado"**
- Ou use o atalho de teclado **"-"**

### Atalhos de Teclado
- **+** ou **=**: Adicionar certificado
- **-**: Remover certificado
- **Escape**: Fechar modal de conquista

### Modais de Conquista
- Aparecem automaticamente ao desbloquear uma nova conquista
- Clique em "Continuar" ou pressione "Escape" para fechar
- Efeito visual de confete para celebrar!

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **TailwindCSS**: Estilização moderna e responsiva
- **JavaScript (DOM)**: Lógica de gamificação e interatividade
- **LocalStorage**: Persistência de dados
- **CSS Animations**: Animações suaves e efeitos visuais

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

## 🎨 Design System

### Cores Principais
- **Primary**: #6366f1 (Índigo)
- **Secondary**: #8b5cf6 (Violeta)
- **Accent**: #f59e0b (Âmbar)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Âmbar)
- **Danger**: #ef4444 (Vermelho)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

## 🔧 Estrutura do Projeto

```
gamified-tracker/
├── index.html          # Página principal
├── src/
│   ├── css/            # Estilos customizados (se necessário)
│   └── js/
│       └── app.js      # Lógica principal da aplicação
├── README.md           # Documentação
└── todo.md            # Lista de tarefas do projeto
```

## 🎯 Fórmula do Ritmo

```javascript
const totalCertificados = 27;
const fim = new Date("2025-08-31");
const hoje = new Date();
const diasRestantes = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
const certificadosEsperados = Math.floor(totalCertificados - (diasRestantes / 2));

// Status do ritmo
if (certificadosConcluidos > certificadosEsperados) {
    // ✅ Adiantado
} else if (certificadosConcluidos === certificadosEsperados) {
    // 🟡 Em dia
} else {
    // ❌ Atrasado
}
```

## 🎉 Recursos Especiais

- **Efeitos Visuais**: Animações de glow, bounce e pulse
- **Feedback Tátil**: Hover states e transições suaves
- **Confete**: Efeito especial ao desbloquear conquistas
- **Gradientes**: Backgrounds e barras com gradientes coloridos
- **Ícones Emoji**: Interface amigável e divertida

## 📈 Motivação

Este site foi criado para tornar o processo de aprendizado mais divertido e motivador, usando elementos de gamificação para:

- 🎯 Manter o foco no objetivo
- 📊 Visualizar o progresso claramente
- 🏆 Celebrar conquistas importantes
- ⚡ Criar senso de urgência saudável
- 🎮 Tornar o aprendizado mais envolvente

---

**Boa sorte na sua jornada para se tornar um desenvolvedor! 🚀**

