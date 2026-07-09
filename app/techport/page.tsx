'use client';

import { useState } from 'react';
import { useTechPort } from '../hooks/useTechPort';
import { ExternalLink } from 'lucide-react';
import { DataCard } from '../components/ui/DataCard';

function orgName(o: any): string {
  return o?.organization_name || o?.name || 'NASA';
}

function formatDate(d: string | undefined | null): string {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!y || !m) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function TechPortPage({ limit, hideHeader }: { limit?: number, hideHeader?: boolean }) {
  const [itemsToShow, setItemsToShow] = useState(limit || 12);
  const { data, isLoading, error } = useTechPort();

  return (
    <div className={`mx-auto max-w-7xl ${hideHeader ? '' : 'px-4 sm:px-6 py-6'} animate-fade-in`}>       
      {!hideHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">NASA TechPort</h1>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            The latest technology projects NASA is working on across its centers.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className={`flex flex-col h-56 bg-bg-card/40 rounded-xl overflow-hidden animate-pulse border border-border/50 ${limit && i > 1 ? 'hidden md:flex' : ''} ${limit && i > 2 ? 'hidden lg:flex' : ''}`}>
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="h-5 w-3/4 bg-border/20 rounded" />
                <div className="h-3 w-1/3 bg-border/20 rounded" />
                <div className="h-3 w-full bg-border/20 rounded mt-1" />
                <div className="h-3 w-5/6 bg-border/20 rounded" />
                <div className="mt-auto flex justify-between">
                  <div className="h-4 w-16 bg-border/20 rounded" />
                  <div className="h-4 w-20 bg-border/20 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-500/10 rounded-xl text-sm border border-red-500/20">
          Could not load NASA technology projects right now.
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
            {data?.slice(0, itemsToShow).map((project: any) => (
              <a 
              key={project.projectId || project.id}
              href={`https://techport.nasa.gov/view/${project.projectId || project.id}`}
              target="_blank"
              rel="noreferrer"
              className="block group h-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary rounded-xl"
            >
              <DataCard className="relative flex flex-col h-full overflow-hidden group-hover:border-border-hover transition-colors border border-border/50 shadow-none hover:shadow-sm p-0">
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <h3 className="font-bold text-sm text-text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.status && (
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                       project.status === 'Active'
                         ? 'bg-accent/10 text-accent'
                         : 'bg-bg-card text-text-muted border border-border/50'
                     }`}>
                       {project.status}
                     </span>
                    )}
                    {project.trlCurrent && (
                     <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-medium">
                       Maturity {project.trlCurrent}/9
                     </span>
                    )}
                    {project.startDate && (
                     <span className="bg-bg-card text-text-muted border border-border/50 px-2 py-0.5 rounded text-[10px]">
                       {formatDate(project.startDate)} – {formatDate(project.endDate)}
                     </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-text-secondary line-clamp-3 mb-3 leading-relaxed">
                    {(project.benefits || project.description || '').replace(/<[^>]*>/g, '')}
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-medium truncate">
                      {orgName(project.leadOrganization)}
                    </span>
                    <ExternalLink size={12} className="text-text-muted opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DataCard>
            </a>
          ))}
          </div>

          {!limit && data && data.length > itemsToShow && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setItemsToShow((prev) => prev + 12)}
                className="px-6 py-2 bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border rounded-lg text-sm font-medium transition-colors"
              >
                ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
