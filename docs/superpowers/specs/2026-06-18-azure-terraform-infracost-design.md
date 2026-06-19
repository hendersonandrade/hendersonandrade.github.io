# Azure + Terraform + Infracost — Artigo hands-on + repo companion

**Data:** 2026-06-18
**Autor:** Henderson Andrade
**Status:** Aprovado para implementação

## Objetivo

Criar o primeiro artigo **prático/laboratório** do blog `hendersonandrade.github.io`, cobrindo
IaC com Terraform no Azure, FinOps com Infracost, pipeline GitHub Actions com OIDC e bootstrap
de backend de state via Bicep. O código real vive num repositório público companion
separado (`azure-iac-with-tf-infracost`), e o artigo o referencia/exibe.

Entrega em **EN + PT-BR**, seguindo o padrão bilíngue do blog. Diagramas em **SVG inline**
no estilo da casa. Espaços reservados para screenshots do laboratório.

## Artefatos e localização

| Artefato | Caminho |
| --- | --- |
| Artigo PT-BR | `D:\workspace\hendersonandrade.github.io\blog\azure-terraform-infracost.pt-br.html` |
| Artigo EN | `D:\workspace\hendersonandrade.github.io\blog\azure-terraform-infracost.html` |
| Índice do blog (card novo) | `blog/index.html` + `blog/index.pt-br.html` |
| Dropdowns de nav (link novo) | todas as páginas com `nav-menu` Blog |
| Código do laboratório | `D:\workspace\azure-iac-with-tf-infracost\` (repo: `github.com/hendersonandrade/azure-iac-with-tf-infracost`) |

## Estrutura do repo companion (`azure-iac-with-tf-infracost`)

```
azure-iac-with-tf-infracost/
├── README.md                      # visão geral, pré-requisitos, como rodar, como destruir
├── .gitignore                     # terraform, *.tfstate, .terraform/, *.tfvars secrets
├── bootstrap/                     # bootstrap do backend de state — Bicep (sem Terraform state)
│   ├── main.bicep                 # RG + Storage Account + container "tfstate" + lock/versioning
│   ├── main.parameters.json
│   └── deploy.sh                  # az deployment sub create ...
├── infra/                         # raiz Terraform (a stack que o pipeline aplica)
│   ├── providers.tf               # azurerm + backend "azurerm" remoto
│   ├── main.tf                    # composição: chama os módulos
│   ├── variables.tf
│   ├── outputs.tf
│   ├── data.tf                    # data sources (azurerm_client_config, RG existente etc.)
│   ├── dev.tfvars
│   └── prod.tfvars
├── modules/
│   ├── networking/                # VNet + subnet + NSG + NIC (suporte à VM)
│   ├── storage-account/           # 1 storage account
│   ├── virtual-machine/           # 1 Linux VM
│   └── app-service/               # 1 App Service (plan + web app)
├── infracost/
│   └── infracost.yml              # config de runs + policy/guardrail
└── .github/
    └── workflows/
        └── terraform.yml          # CI/CD: fmt/validate/plan/Infracost/apply via OIDC
```

Decisão de escopo: além de storage/VM/app service (pedido do usuário), incluir **módulo
networking mínimo** (VNet + subnet + NSG + NIC) porque a VM exige rede para ser uma amostra
enterprise plausível. Manter tudo enxuto — sem Key Vault/Log Analytics nesta versão (YAGNI).

## Estrutura do artigo (seções e âncoras)

1. **`#iac`** — O que é IaC: declarativo vs imperativo, idempotência, drift, state, imutabilidade;
   por que importa. *SVG: ciclo write → plan → apply → state.*
2. **`#finops`** — FinOps (Inform/Optimize/Operate) e o custo invisível; shift-left de custo no PR.
   *SVG: custo no PR vs na fatura.*
3. **`#infracost`** — Infracost a fundo: o que é, como funciona (parse do plan → preço via API →
   breakdown/diff), Infracost Cloud, guardrails, vantagens e limitações. *SVG: pipeline Infracost.*
4. **`#arquitetura`** — A estrutura enterprise de IaC: árvore de pastas, módulos reutilizáveis,
   convenções de naming, data sources. *SVG: composição de módulos.*
5. **`#backend-bicep`** — Por que o tfstate é provisionado via Bicep (chicken-and-egg): backend
   remoto precisa existir antes do Terraform; Bicep faz o bootstrap idempotente sem state próprio;
   lock, versioning, criptografia. *SVG: Bicep → backend → Terraform.*
6. **`#oidc`** — Workload Identity Federation (OIDC) sem segredos: trust GitHub ↔ Entra ID,
   subject claim, `azure/login` sem senha. *SVG: troca de token OIDC.*
7. **`#terraform-sample`** — Samples Terraform comentados (do repo): providers+backend, módulo
   storage, variables, tfvars, data source. 🖼️ placeholder: `terraform plan`.
8. **`#pipeline`** — Pipeline GitHub Actions passo a passo: trigger, `permissions: id-token`,
   `azure/login` OIDC, fmt/validate, plan (artefato), gate de aprovação, apply na main.
   🖼️ placeholders: run do Actions, job de plan, aprovação de environment.
9. **`#infracost-pipeline`** — Integrar Infracost no pipeline: setup, breakdown/diff, comentário
   no PR, infracost.yml + policy de guardrail. 🖼️ placeholders: comentário no PR, dashboard.
10. **`#checklist`** — Checklist de produção.
11. **`#references`** — Referências oficiais (HashiCorp, Microsoft Learn, Infracost).

### Extras incluídos
- Box de **pré-requisitos** no topo (Azure, GitHub, Terraform CLI, Azure CLI, conta Infracost).
- **Nota de custo real** do laboratório (alinhada ao tema FinOps).
- Box **"como destruir o lab"** (`terraform destroy`) para evitar custo esquecido.
- Cross-links para Landing Zones e CAF (IaC = 8ª área de design).

## Padrões técnicos

- Reusar `<head>`, header/nav, footer e classes CSS existentes (`docs-shell`, `figure`, `note`,
  `badge`, `ref-list`, `next-prev`). Zero CSS novo, exceto:
  - classe utilitária para **placeholder de imagem do lab** (caixa tracejada).
  - bloco `<pre><code>` se ainda não existir em `style.css` (paleta `#0c1324`, JetBrains Mono).
- Atualizar dropdown "Blog" do nav e o card do `blog/index*` em ambos idiomas.
- Sem auto-commit (preferência do usuário: ele commita manualmente).

## Decisões em aberto resolvidas
- Idioma: **EN + PT-BR** juntos.
- Código: **repo companion separado** já existente (`azure-iac-with-tf-infracost`), vazio.
- Diagramas: **SVG inline** (padrão da casa) + placeholders de imagem para screenshots.
- Recursos extras: **+ networking mínimo** para a VM; sem Key Vault/LAW nesta versão.

## Critérios de sucesso
- Artigo bilíngue publicado e linkado no índice + nav.
- Repo companion com Terraform que passa `terraform fmt/validate`, Bicep válido, workflow YAML
  coerente, README completo.
- Infracost integrado ao pipeline com comentário de PR e guardrail.
- Custo do laboratório documentado; instruções de destroy presentes.
