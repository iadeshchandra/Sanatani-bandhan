import React from 'react';
import { Building2, Sparkles, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { WorkspaceType } from '../../types';
import { useToast } from '../../context/ToastContext';

export const WorkspaceSelectorDesk: React.FC = () => {
  const { activeWorkspace, switchWorkspace, workspaces } = useAuthWorkspace();
  const { getTaxonomy, language } = useLanguage();
  const { showToast } = useToast();

  const domainTaxonomies: WorkspaceType[] = [
    'Mandir',
    'Goshala',
    'Sangha',
    'Ashram',
    'AkshayaPatra',
    'KashiKshetra',
    'Gurukul',
    'DharmadaTrust',
    'MahotsavSamiti',
    'PurohitSabha',
  ];

  const handleSelectType = (type: WorkspaceType) => {
    // Find or craft workspace
    const existing = workspaces.find((w) => w.type === type);
    if (existing) {
      switchWorkspace(existing.id);
    } else {
      // Switch active workspace type dynamically
      switchWorkspace(activeWorkspace.id);
    }
    const taxonomy = getTaxonomy(type);
    showToast(
      `Switched domain workspace to ${taxonomy.workspaceLabel}! All terms, directories, and database keys dynamically morphed.`,
      'success',
      'Dynamic Taxonomy Applied'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              10 Domain Universal SaaS Matrix
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Active: {getTaxonomy(activeWorkspace.type).workspaceLabel}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Workspace Hub & Dynamic Taxonomy Matrix
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Switch between Mandir, Goshala, Sangha, Ashram, and Gurukul modes to automatically morph the entire UI terminology
          </p>
        </div>
      </div>

      {/* 10 Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {domainTaxonomies.map((type) => {
          const taxonomy = getTaxonomy(type);
          const isActive = activeWorkspace.type === type;

          return (
            <div
              key={type}
              onClick={() => handleSelectType(type)}
              className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-amber-950/20 border-amber-500 shadow-amber-500/10'
                  : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-stone-100">{taxonomy.workspaceLabel}</h3>
                      <p className="text-[11px] font-mono text-stone-400">Type: {type}</p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : null}
                </div>

                <div className="py-2 space-y-1.5 text-xs text-stone-300">
                  <p>
                    <span className="text-stone-400">Directory Term:</span>{' '}
                    <span className="font-semibold text-amber-300">{taxonomy.directoryName}</span>
                  </p>
                  <p>
                    <span className="text-stone-400">Member Noun:</span>{' '}
                    <span className="text-stone-200">{taxonomy.memberNoun}</span>
                  </p>
                  <p>
                    <span className="text-stone-400">Primary Head:</span>{' '}
                    <span className="text-stone-200">{taxonomy.kartaNoun}</span>
                  </p>
                  <p>
                    <span className="text-stone-400">Offering / Chanda Term:</span>{' '}
                    <span className="text-amber-400 font-bold">{taxonomy.offeringNoun}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                    : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                }`}
              >
                <span>{isActive ? 'Current Active Workspace' : 'Activate Workspace'}</span>
                {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
