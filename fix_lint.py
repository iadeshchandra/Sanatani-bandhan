import re

# Fix DevoteeGrid.tsx imports
with open('src/components/domain1/DevoteeGrid.tsx', 'r') as f:
    content = f.read()

content = content.replace("  CheckCircle,\n} from 'lucide-react';", "  CheckCircle,\n  ShieldCheck,\n} from 'lucide-react';")

with open('src/components/domain1/DevoteeGrid.tsx', 'w') as f:
    f.write(content)

# Fix PortalLogin.tsx Toast and Sparkles
with open('src/components/public/PortalLogin.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ArrowLeft, ShieldCheck, User, KeyRound, Building2, MapPin, Loader2, IndianRupee } from 'lucide-react';", 
                          "import { ArrowLeft, ShieldCheck, User, KeyRound, Building2, MapPin, Loader2, IndianRupee, Sparkles } from 'lucide-react';")

content = content.replace("showToast('success', 'Admin access granted.');", "showToast('Admin access granted.', 'success');")
content = content.replace("showToast('error', 'Invalid workspace ID or Master PIN.');", "showToast('Invalid workspace ID or Master PIN.', 'error');")
content = content.replace("showToast('error', 'Devotee phone lookup failed (Mock environment).');", "showToast('Devotee phone lookup failed (Mock environment).', 'error');")
content = content.replace("showToast('error', 'Please complete all required fields.');", "showToast('Please complete all required fields.', 'error');")
content = content.replace("showToast('success', `Provisioned new ${newOrgType} shard successfully.`);", "showToast(`Provisioned new ${newOrgType} shard successfully.`, 'success');")

with open('src/components/public/PortalLogin.tsx', 'w') as f:
    f.write(content)
