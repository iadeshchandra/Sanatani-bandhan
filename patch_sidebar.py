with open('src/components/common/Sidebar.tsx', 'r') as f:
    content = f.read()

if "import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';" not in content:
    content = content.replace(
        "import { useLanguage } from '../../context/LanguageContext';",
        "import { useLanguage } from '../../context/LanguageContext';\nimport { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';"
    )

content = content.replace(
    "const { getTaxonomy } = useLanguage();\n  const taxonomy = getTaxonomy(activeWorkspace.type);",
    "const taxonomy = useWorkspaceTaxonomy();"
)

with open('src/components/common/Sidebar.tsx', 'w') as f:
    f.write(content)
