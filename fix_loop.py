with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the inner return inside AppRouter
content = content.replace("  if (isAuthenticated) {\n    return <AppContent />;\n  }", "  if (isAuthenticated) {\n    return <AppContent />;\n  }")

# Ensure the main App renders AppRouter
content = content.replace("<DataProvider>\n                <AppContent />\n              </DataProvider>", "<DataProvider>\n                <AppRouter />\n              </DataProvider>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
