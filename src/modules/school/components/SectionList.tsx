import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface ResourceItem {
  id: number;
  resourceName: string;
  instructions: string;
  externalUrl: string;
}

export function SectionList({ resources = [] }: { resources?: ResourceItem[] }) {
  const [expandedResource, setExpandedResource] = useState<number | null>(null);

  if (!resources || resources.length === 0) {
    return (
      <div className="p-3 bg-brown rounded-bottom">
        <h5 className="text-white mb-3">📌 Recursos del Curso</h5>
        <p className="text-white-50">No hay recursos disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-brown rounded-bottom">
      <h5 className="text-white mb-3">📌 Recursos del Curso</h5>
      <div className="list-group">
        {resources.map((resource) => (
          <div key={resource.id} className="list-group-item bg-transparent border-0 p-0 mb-2">
            <div 
              className="d-flex justify-content-between align-items-center p-2 rounded cursor-pointer bg-brown-light hover-effect"
              onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
            >
              <span className="text-white">{resource.resourceName}</span>
              <span className={`transition-all duration-300 ${expandedResource === resource.id ? 'rotate-180' : ''}`}>
                <FaChevronDown className="text-white" />
              </span>
            </div>
            
            {expandedResource === resource.id && (
              <div className="p-3 bg-brown-light rounded-bottom animate-fade-in">
                <p className="text-white mb-2">{resource.instructions}</p>
                {resource.externalUrl && (
                  <a 
                    href={resource.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Abrir Recurso
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}