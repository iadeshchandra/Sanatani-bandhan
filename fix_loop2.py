with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace all <AppRouter /> back to <AppContent /> inside AppRouter logic
if "return <AppRouter />;" in content:
    content = content.replace("  if (isAuthenticated) {\n    return <AppRouter />;\n  }", "  if (isAuthenticated) {\n    return <AppContent />;\n  }")

# But make sure App renders AppRouter
content = content.replace("<DataProvider>\n                <AppContent />\n              </DataProvider>", "<DataProvider>\n                <AppRouter />\n              </DataProvider>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
