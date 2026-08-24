with open('src/components/domain1/DevoteeGrid.tsx', 'r') as f:
    content = f.read()

if "import { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';" not in content:
    content = content.replace(
        "import { useLanguage } from '../../context/LanguageContext';",
        "import { useLanguage } from '../../context/LanguageContext';\nimport { useWorkspaceTaxonomy } from '../../hooks/useWorkspaceTaxonomy';"
    )

content = content.replace(
    "const { getTaxonomy } = useLanguage();",
    ""
)

content = content.replace(
    "const taxonomy = getTaxonomy(activeWorkspace.type);",
    "const taxonomy = useWorkspaceTaxonomy();"
)

with open('src/components/domain1/DevoteeGrid.tsx', 'w') as f:
    f.write(content)
