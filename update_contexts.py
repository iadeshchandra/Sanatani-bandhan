import re

def update_data_context():
    with open('src/context/DataContext.tsx', 'r') as f:
        content = f.read()

    # Add import
    content = content.replace("import React, { createContext, useContext, useEffect, useState } from 'react';",
                              "import React, { createContext, useContext, useEffect, useState } from 'react';\nimport { useInitialData } from './AppInitializer';\nimport { set } from 'idb-keyval';")

    # Add hook inside provider
    content = content.replace("  const { showToast } = useToast();",
                              "  const { showToast } = useToast();\n  const initialData = useInitialData();")

    # Replace initialization
    keys = [
        ('sb_families', 'INITIAL_FAMILIES'),
        ('sb_vanshavali', 'INITIAL_VANSHAVALI'),
        ('sb_guests', 'INITIAL_GUESTS'),
        ('sb_treasury', 'INITIAL_TREASURY'),
        ('sb_assets', 'INITIAL_ASSETS'),
        ('sb_inventory', 'INITIAL_INVENTORY'),
        ('sb_pooja_bookings', 'INITIAL_POOJA_BOOKINGS')
    ]
    for key, initial in keys:
        pattern = f"const s = localStorage.getItem\\('{key}'\\);\n    return s \\? JSON.parse\\(s\\) : {initial};"
        replacement = f"const s = initialData.{key};\n    return s ? s : {initial};"
        content = re.sub(pattern, replacement, content)

    # Replace localStorage.setItem with set
    content = content.replace("localStorage.setItem('sb_", "set('sb_")
    # set is async, so we can just call it (fire and forget) or handle it.
    # The current code uses localStorage.setItem('key', JSON.stringify(val))
    # We want set('key', val)
    content = re.sub(r"set\('sb_([a-z_]+)', JSON.stringify\(([a-zA-Z_]+)\)\);", r"set('sb_\1', \2);", content)

    with open('src/context/DataContext.tsx', 'w') as f:
        f.write(content)

def update_auth_context():
    with open('src/context/AuthWorkspaceContext.tsx', 'r') as f:
        content = f.read()

    content = content.replace("import React, { createContext, useContext, useState, useEffect } from 'react';",
                              "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport { useInitialData } from './AppInitializer';\nimport { set } from 'idb-keyval';")

    content = content.replace("export const AuthWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {",
                              "export const AuthWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {\n  const initialData = useInitialData();")

    content = re.sub(
        r"const saved = localStorage.getItem\('sanatani_workspaces'\);\n    if \(saved\) \{\n      try \{\n        return JSON.parse\(saved\);\n      \} catch \(e\) \{\n        console.error\('Error loading workspaces', e\);\n      \}\n    \}\n    return INITIAL_WORKSPACES;",
        "return initialData.sanatani_workspaces || INITIAL_WORKSPACES;",
        content
    )
    
    content = re.sub(
        r"const saved = localStorage.getItem\('sanatani_active_workspace_id'\);\n    return saved \|\| 'ws-mandir';",
        "return initialData.sanatani_active_workspace_id || 'ws-mandir';",
        content
    )

    content = re.sub(
        r"const saved = localStorage.getItem\('sanatani_user_role'\);\n    return \(saved as UserRole\) \|\| 'head_admin';",
        "return initialData.sanatani_user_role || 'head_admin';",
        content
    )

    content = re.sub(
        r"const saved = localStorage.getItem\('sanatani_current_devotee'\);\n    if \(saved\) \{\n      try \{\n        return JSON.parse\(saved\);\n      \} catch \(e\) \{\n        console.error\('Error parsing devotee', e\);\n      \}\n    \}\n    return null;",
        "return initialData.sanatani_current_devotee || null;",
        content
    )

    # Sync
    content = re.sub(r"localStorage.setItem\('sanatani_workspaces', JSON.stringify\(workspaces\)\);", r"set('sanatani_workspaces', workspaces);", content)
    content = re.sub(r"localStorage.setItem\('sanatani_active_workspace_id', activeWorkspaceId\);", r"set('sanatani_active_workspace_id', activeWorkspaceId);", content)
    content = re.sub(r"localStorage.setItem\('sanatani_user_role', role\);", r"set('sanatani_user_role', role);", content)
    content = re.sub(r"localStorage.setItem\('sanatani_current_devotee', JSON.stringify\(match\)\);", r"set('sanatani_current_devotee', match);", content)
    content = re.sub(r"localStorage.removeItem\('sanatani_current_devotee'\);", r"set('sanatani_current_devotee', null);", content)

    # Note: custom logos use dynamic keys: localStorage.setItem(`sb_logo_${activeWorkspaceId}`, base64);
    content = re.sub(r"localStorage.setItem\(`sb_logo_\$\{activeWorkspaceId\}`", r"set(`sb_logo_${activeWorkspaceId}`", content)

    with open('src/context/AuthWorkspaceContext.tsx', 'w') as f:
        f.write(content)

def update_language_context():
    with open('src/context/LanguageContext.tsx', 'r') as f:
        content = f.read()

    content = content.replace("import React, { createContext, useContext, useState, useEffect } from 'react';",
                              "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport { useInitialData } from './AppInitializer';\nimport { set } from 'idb-keyval';")

    content = content.replace("export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {",
                              "export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {\n  const initialData = useInitialData();")

    content = re.sub(
        r"const saved = localStorage.getItem\('sanatani_app_lang'\);\n    return \(saved as LanguageCode\) \|\| 'en';",
        "return initialData.sanatani_app_lang || 'en';",
        content
    )

    content = re.sub(r"localStorage.setItem\('sanatani_app_lang', lang\);", r"set('sanatani_app_lang', lang);", content)

    with open('src/context/LanguageContext.tsx', 'w') as f:
        f.write(content)

update_data_context()
update_auth_context()
update_language_context()
