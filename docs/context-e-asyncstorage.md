# Context e AsyncStorage

Guia de estudo sobre as duas peças que guardam os dados do app Pomodoro. Todos os exemplos vêm do próprio código do projeto:

- `src/context/app-data.tsx`: o Context
- `src/storage/storage.ts`: as funções que falam com o AsyncStorage
- `src/hooks/use-timer.ts` e `src/app/(tabs)/progress.tsx`: quem usa o Context

---

## 1. O problema que os dois resolvem

Imagine o app sem eles. O Timer termina um pomodoro e cria uma sessão:

```ts
const [sessions, setSessions] = useState<Session[]>([]); // dentro do Timer
```

Dois problemas aparecem logo:

1. **A tela de Progresso não enxerga essa lista.** Um `useState` pertence ao componente que o criou. O Timer e o Progresso são telas diferentes, e uma não tem acesso ao estado da outra.
2. **Fechou o app, perdeu tudo.** O estado do React vive na memória. Quando o app fecha, a memória é liberada e a lista some.

| Problema | Quem resolve |
|---|---|
| Várias telas precisam do mesmo dado | **Context** |
| O dado precisa sobreviver ao fechar o app | **AsyncStorage** |

Eles resolvem coisas diferentes e funcionam juntos. O Context é a memória do app aberto. O AsyncStorage é o arquivo guardado no celular.

---

## 2. Context

### 2.1 A ideia

Um Context é uma **caixa de dados colocada acima das telas**. Qualquer componente que esteja dentro dela pode ler os dados e chamar as funções que ela oferece, sem precisar receber nada por props.

```
AppDataProvider            ← a caixa: guarda sessions, tasks...
└── Stack (layout raiz)
    ├── (tabs)
    │   ├── Timer          ← usa addSession
    │   ├── Progresso      ← usa sessions
    │   └── Configurações
    └── Tarefas            ← vai usar tasks, addTask...
```

Sem o Context, você teria que criar o estado num componente acima de todos e passá-lo por props, tela por tela, até chegar em quem precisa. Esse "passa-passa" se chama **prop drilling** e fica confuso rápido.

### 2.2 As três peças

Todo Context tem as mesmas três partes. No nosso arquivo:

**Peça 1: o formato e a caixa**

```ts
type AppData = {
    sessions: Session[];
    addSession: (session: Session) => void;
    // ... tarefas e tarefa selecionada
};

const AppDataContext = createContext<AppData | null>(null);
```

- `AppData` é o **contrato**: a lista de tudo o que a caixa oferece. Se o Provider esquecer de entregar alguma coisa, o TypeScript avisa.
- `createContext` cria a caixa vazia (`null`). Os dados de verdade quem coloca é o Provider.

**Peça 2: o Provider, quem guarda os dados**

```tsx
export function AppDataProvider({ children }: { children: ReactNode }) {
    const [sessions, setSessions] = useState<Session[]>([]);

    function addSession(session: Session) {
        setSessions((prev) => [...prev, session]);
    }

    return (
        <AppDataContext.Provider value={{ sessions, addSession }}>
            {children}
        </AppDataContext.Provider>
    );
}
```

- É um componente comum, com `useState` comum. A diferença está no `return`: ele envolve os `children` com o `<AppDataContext.Provider value={...}>`.
- O `value` é o que fica disponível para quem está dentro.
- `children` é tudo que for colocado entre `<AppDataProvider>` e `</AppDataProvider>`. No nosso caso, o app inteiro:

```tsx
// src/app/_layout.tsx
<AppDataProvider>
    <Stack>...</Stack>
</AppDataProvider>
```

**Peça 3: o hook, como as telas usam**

```ts
export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error('useAppData must be used inside AppDataProvider');
    return context;
}
```

- `useContext` procura o Provider mais próximo acima do componente e devolve o `value` dele.
- Se não encontrar nenhum Provider, devolve `null`. O `throw` transforma isso numa mensagem clara, em vez de um erro confuso mais adiante.

E o uso nas telas fica assim:

```ts
const { sessions } = useAppData();     // Progresso: só lê
const { addSession } = useAppData();   // useTimer: só escreve
```

### 2.3 O que acontece quando um dado muda

Quando o Timer termina um foco:

```
1. useTimer chama addSession(novaSessao)
2. addSession chama setSessions(...) dentro do Provider
3. O estado do Provider muda → o Provider redesenha com um novo value
4. Todos os componentes que usam useAppData() redesenham com os dados novos
5. A tela de Progresso passa a mostrar a sessão nova
```

Quem muda o dado (o Timer) e quem mostra (o Progresso) não se conhecem. Os dois só conhecem o Context.

### 2.4 Imutabilidade: por que nunca usar `push`

O React só percebe que um estado mudou quando recebe **um valor novo**. Se você modifica o array que já existe, para o React é "o mesmo array", e a tela não atualiza.

```ts
sessions.push(nova);                          // ❌ modifica o array antigo
setSessions((prev) => [...prev, nova]);       // ✅ cria um array novo
```

As três operações do app, cada uma criando um array novo:

| Operação | Código | Como funciona |
|---|---|---|
| Adicionar | `[...prev, task]` | Copia todos os itens e acrescenta o novo no fim |
| Alterar | `prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)` | Percorre todos. O item certo sai como uma cópia alterada, os outros saem iguais |
| Remover | `prev.filter(t => t.id !== id)` | Fica só com os itens que passam no teste |

**Por que `(prev) => ...` em vez de usar `sessions` direto?** Essa "forma de função" do `setState` recebe sempre o valor mais recente do estado. É mais segura quando o valor novo depende do anterior, por exemplo se duas atualizações acontecem quase ao mesmo tempo.

### 2.5 Quando usar (e quando não usar) Context

**Use** quando o mesmo dado é lido ou alterado por várias telas:
- `sessions`: o Timer cria e o Progresso mostra
- `tasks`: a tela de Tarefas cria e o Timer mostra a tarefa em foco
- `selectedTaskId`: a tela de Tarefas escolhe e o Timer usa

**Não use** para estado que só uma tela usa:
- `status`, `endsAt`, `now` do timer ficam no `useTimer`, porque só o Timer precisa deles
- o texto digitado num campo fica no `useState` da própria tela

Colocar tudo no Context faz todas as telas redesenharem a cada mudança, até as que não usam aquele dado.

### 2.6 Erros comuns

| Sintoma | Causa provável |
|---|---|
| "useAppData must be used inside AppDataProvider" | O componente está fora do Provider. Confira o `_layout.tsx` raiz |
| A tela não atualiza depois de adicionar algo | O array foi modificado com `push` ou atribuição, em vez de criar um novo |
| TypeScript: "is missing the following properties" | O `value` do Provider não entrega tudo o que o tipo `AppData` promete |

---

## 3. AsyncStorage

### 3.1 A ideia

O AsyncStorage é um **armazenamento de chave e valor salvo no celular**. Pense num armário com gavetas etiquetadas: cada gaveta tem um nome (a chave) e guarda um papel com texto (o valor).

```
Chave        Valor (texto)
──────────   ─────────────────────────────────────────────
"sessions"   '[{"id":"17311...","type":"focus",...}, ...]'
"tasks"      '[{"id":"17312...","title":"Estudar React",...}]'
```

Os dados ficam lá mesmo depois de fechar o app ou desligar o celular. Só somem se o app for desinstalado ou se os dados dele forem apagados nas configurações.

Pacote usado no projeto: `@react-native-async-storage/async-storage`, instalado com `npx expo install`. Ele funciona no Expo Go.

### 3.2 Regra 1: só guarda texto

O AsyncStorage só aceita **strings**. Para guardar um array de objetos, você converte para texto antes de salvar e converte de volta ao ler. Esse formato de texto é o **JSON**:

```ts
const tasks = [{ id: '1', title: 'Estudar', completed: false }];

const text = JSON.stringify(tasks);
// '[{"id":"1","title":"Estudar","completed":false}]'

const back = JSON.parse(text);
// [{ id: '1', title: 'Estudar', completed: false }]
```

**Consequência importante:** um objeto `Date` não sobrevive à ida e volta. O `JSON.stringify` transforma a data em texto, e o `JSON.parse` devolve esse texto, não um `Date`. Por isso, no app, as datas já são guardadas como texto desde o começo (`createdAt: string`, `startedAt: string`).

### 3.3 Regra 2: é assíncrono

Ler e gravar no armazenamento do celular leva um tempinho. Para não travar o app enquanto isso, as funções do AsyncStorage devolvem uma **Promise**: uma "promessa" de que o resultado vai chegar.

Existem duas formas de esperar uma Promise.

**`async` / `await`**, usada no `storage.ts`:

```ts
async function exemplo() {
    const raw = await AsyncStorage.getItem('tasks'); // pausa aqui até chegar
    console.log(raw);                               // só roda depois
}
```

- O `await` só pode ser usado dentro de uma função marcada com `async`.
- Toda função `async` também devolve uma Promise.

**`.then(...)`**, usada no Provider:

```ts
loadJSON<Task[]>('tasks', []).then((saved) => {
    setTasks(saved);   // roda quando o resultado chegar
});
```

O `.then` é usado dentro do `useEffect` porque a função do `useEffect` **não pode** ser `async`.

### 3.4 Nossas funções: `loadJSON` e `saveJSON`

Em vez de espalhar `AsyncStorage`, `JSON.stringify` e `JSON.parse` pelo app, o `storage.ts` concentra tudo em duas funções.

**Salvar**

```ts
export async function saveJSON(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}
```

- `unknown`: aceita qualquer valor, porque a função só converte para texto.
- `Promise<void>`: devolve uma Promise que não carrega resultado nenhum, só avisa que terminou.

**Carregar**

```ts
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch (error) {
        console.warn(`Failed to load "${key}"`, error);
        return fallback;
    }
}
```

Linha a linha:

| Trecho | O que faz |
|---|---|
| `<T>` | **Genérico**: um tipo "coringa" decidido na chamada. `loadJSON<Task[]>(...)` faz o `T` virar `Task[]` |
| `fallback: T` | O valor usado quando não há nada salvo ou quando algo dá errado. No app, `[]` |
| `getItem(key)` | Devolve o texto salvo, ou `null` se aquela chave nunca foi usada |
| `if (raw === null) return fallback` | Primeira vez que o app abre: ainda não há nada salvo |
| `JSON.parse(raw) as T` | Converte o texto de volta. O `as T` diz ao TypeScript para confiar que o dado tem aquele formato |
| `try / catch` | Se qualquer coisa falhar (armazenamento com problema, texto corrompido), o app não quebra: avisa no terminal e usa o fallback |

### 3.5 O que o AsyncStorage não é

- **Não é seguro.** Os dados não são criptografados. Nunca guarde senhas ou tokens nele. Para isso existe o `expo-secure-store`.
- **Não é um banco de dados.** Ele não faz buscas nem filtros: você lê a lista inteira e filtra no JavaScript. Para um app com milhares de registros, o caminho seria o `expo-sqlite`. Para o nosso tamanho, o AsyncStorage é perfeito.

---

## 4. Os dois juntos: o ciclo completo

O Provider é onde o Context e o AsyncStorage se encontram:

```tsx
// 1. Carregar as listas salvas quando o app abre
useEffect(() => {
    Promise.all([
        loadJSON<Session[]>(STORAGE_KEYS.sessions, []),
        loadJSON<Task[]>(STORAGE_KEYS.tasks, []),
    ]).then(([savedSessions, savedTasks]) => {
        setSessions(savedSessions);
        setTasks(savedTasks);
        setIsLoaded(true);
    });
}, []);

// 2. Salvar cada lista sempre que ela mudar
useEffect(() => {
    if (!isLoaded) return;
    saveJSON(STORAGE_KEYS.tasks, tasks);
}, [tasks, isLoaded]);
```

### A linha do tempo

```
App abre
 │
 ├─ Provider nasce com sessions = [], tasks = [], isLoaded = false
 │
 ├─ Efeito de carregar começa a ler o celular  (leva alguns milissegundos)
 │     │
 │     └─ Chegou! → setSessions(...), setTasks(...), setIsLoaded(true)
 │
 ├─ Telas redesenham com os dados salvos
 │
 └─ Usuário adiciona uma tarefa
       │
       ├─ addTask → setTasks([...prev, nova])
       ├─ Context entrega a lista nova → telas redesenham
       └─ Efeito de salvar percebe que tasks mudou → saveJSON('tasks', ...)
```

### Peças que aparecem aqui

- **`[]` como dependência** do efeito de carregar: ele roda uma vez só, quando o Provider aparece.
- **`Promise.all([...])`:** espera várias Promises ao mesmo tempo e entrega os resultados na mesma ordem. As duas listas chegam juntas, e o `isLoaded` só vira `true` quando ambas estão prontas.
- **`[tasks, isLoaded]`** como dependência do efeito de salvar: ele roda toda vez que a lista muda.

### A armadilha do `isLoaded`

Sem a linha `if (!isLoaded) return;`, a sequência seria:

```
1. Provider nasce com tasks = []
2. Efeito de salvar roda imediatamente → grava [] no celular   ← apagou tudo!
3. Efeito de carregar termina de ler... o [] que acabou de ser gravado
```

O usuário perderia todo o histórico a cada abertura do app. O `isLoaded` garante que nada é salvo antes de os dados salvos terem sido carregados.

### Por que a chave não pode mudar

As chaves (`'sessions'`, `'tasks'`) são os nomes das gavetas. Se você trocar `'sessions'` por `'sessionList'` no código, o app passa a procurar numa gaveta vazia, e o histórico antigo "some". Os dados continuam no celular, mas ninguém mais os lê. Por isso as chaves ficam num lugar só (`STORAGE_KEYS`) e não devem ser renomeadas.

---

## 5. Glossário rápido

| Termo | Significado |
|---|---|
| **Context** | Caixa de dados acessível por todos os componentes dentro do seu Provider |
| **Provider** | O componente que guarda os dados e os disponibiliza pelo `value` |
| **Prop drilling** | Passar dados por props, componente por componente, até chegar em quem precisa |
| **Imutabilidade** | Nunca alterar o estado existente: sempre criar um valor novo |
| **Spread (`...`)** | Copia os itens de um array (`[...lista]`) ou os campos de um objeto (`{ ...obj }`) |
| **`map` / `filter`** | Métodos de array que criam um array novo, alterando ou filtrando itens |
| **AsyncStorage** | Armazenamento de chave e valor (texto) que sobrevive ao fechar o app |
| **JSON** | Formato de texto para representar objetos e arrays. `stringify` converte para texto, `parse` converte de volta |
| **Promise** | Um valor que vai chegar no futuro |
| **`async` / `await`** | Forma de escrever código com Promises como se fosse em sequência |
| **Genérico (`<T>`)** | Tipo "coringa" que é definido na hora de chamar a função |
| **Fallback** | Valor reserva, usado quando o normal não está disponível |

---

## 6. Para testar o seu entendimento

Tente responder sem olhar o código. São boas perguntas para se preparar para a apresentação.

1. Por que o `status` do timer fica no `useTimer` e não no Context?
2. O que aconteceria se o `addSession` usasse `sessions.push(session)`?
3. Por que o `useEffect` de carregar usa `.then` em vez de `await`?
4. Se você apagar a linha `if (!isLoaded) return;`, o que acontece ao abrir o app?
5. Por que o tipo `Session` guarda `startedAt` como `string` e não como `Date`?
6. Você poderia guardar a senha de um usuário no AsyncStorage? Por quê?
7. O que o `loadJSON` devolve na primeira vez que o app é aberto?
8. Se o `removeTask` não limpasse o `selectedTaskId`, que problema apareceria no Timer?
