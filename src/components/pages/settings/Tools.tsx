import { Wrench, SlidersHorizontal, Database, FileUp } from 'lucide-react';

export function Tools() {
  const tools = [
    {
      id: 'artikelvelden-instellingen',
      name: 'Artikelvelden per Hoofdcategorie',
      description: 'Configureer welke velden zichtbaar zijn per productgroep',
      icon: SlidersHorizontal,
    },
    {
      id: 'data-import',
      name: 'Data Import',
      description: 'Importeer klanten, artikelen en prijslijsten',
      icon: FileUp,
    },
    {
      id: 'database-tools',
      name: 'Database Tools',
      description: 'Database onderhoud en optimalisatie',
      icon: Database,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tools</h1>
        <p className="text-slate-600">Beheer systeem tools en utilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-slate-600">{tool.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Over Tools</h3>
            <p className="text-sm text-blue-800">
              De Tools sectie bevat utilities voor systeem beheer, data import en configuratie.
              Gebruik deze tools om uw systeem te optimaliseren en aan te passen aan uw behoeften.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
