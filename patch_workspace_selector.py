with open('src/components/domain6/WorkspaceSelectorDesk.tsx', 'r') as f:
    content = f.read()

if "import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';" not in content:
    content = content.replace(
        "import { useLanguage } from '../../context/LanguageContext';",
        "import { useLanguage } from '../../context/LanguageContext';\nimport { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';"
    )

content = content.replace(
    "const { getTaxonomy, language } = useLanguage();",
    "const { getTaxonomy, language } = useLanguage();\n  const activeTaxonomy = useWorkspaceTaxonomy();"
)

content = content.replace(
    "Active: {getTaxonomy(activeWorkspace.type).workspaceLabel}",
    "Active: {activeTaxonomy.workspaceLabel}"
)

with open('src/components/domain6/WorkspaceSelectorDesk.tsx', 'w') as f:
    f.write(content)
